import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const execFileAsync = promisify(execFile);
const JS_SCRIPT_PATH = resolve('scripts/validate-portfolio.js');

describe('Node.js Manifest Validator Script', () => {
  it('validates a valid PORTFOLIO.json object via Node.js script', async () => {
    const validManifest = JSON.stringify({
      title: 'Valid Project',
      summary: 'A valid project description containing at least 40 characters for testing.',
      category: 'Test Category',
      date: '2026-07',
      tier: 1,
      priority: 100,
      techStack: ['Node.js', 'Vue 3'],
    });

    const { stdout, stderr } = await execFileAsync('node', [JS_SCRIPT_PATH, '-'], {
      input: validManifest,
    });

    assert.match(stdout, /VALID: -/);
    assert.equal(stderr, '');
  });

  it('rejects an invalid PORTFOLIO.json object with validation errors via Node.js script', async () => {
    const invalidManifest = JSON.stringify({
      title: 'A', // Too short (<2 chars)
      summary: 'Short', // Too short (<40 chars)
      tier: 5, // Invalid tier (must be 1, 2, or 3)
    });

    try {
      await execFileAsync('node', [JS_SCRIPT_PATH, '-'], {
        input: invalidManifest,
      });
      assert.fail('Should have failed validation');
    } catch (error) {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /INVALID: -/);
      assert.match(error.stderr, /missing required field/);
    }
  });
});
