import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve, join } from 'node:path';
import { writeFile, rm, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);
const JS_SCRIPT_PATH = resolve('scripts/validate-portfolio.js');

describe('Node.js Manifest Validator Script', () => {
  it('validates a valid PORTFOLIO.json file via Node.js script', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'portfolio-val-'));
    const tempFile = join(tempDir, 'PORTFOLIO.json');

    const validManifest = JSON.stringify({
      title: 'Valid Project',
      summary: 'A valid project description containing at least 40 characters for testing.',
      category: 'Test Category',
      date: '2026-07',
      tier: 1,
      priority: 100,
      techStack: ['Node.js', 'Vue 3'],
    });

    try {
      await writeFile(tempFile, validManifest, 'utf8');

      const { stdout, stderr } = await execFileAsync('node', [JS_SCRIPT_PATH, tempFile]);

      assert.match(stdout, /VALID:/);
      assert.equal(stderr, '');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('rejects an invalid PORTFOLIO.json file with validation errors via Node.js script', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'portfolio-val-'));
    const tempFile = join(tempDir, 'PORTFOLIO.json');

    const invalidManifest = JSON.stringify({
      title: 'A', // Too short (<2 chars)
      summary: 'Short', // Too short (<40 chars)
      tier: 5, // Invalid tier (must be 1, 2, or 3)
    });

    try {
      await writeFile(tempFile, invalidManifest, 'utf8');

      await execFileAsync('node', [JS_SCRIPT_PATH, tempFile]);
      assert.fail('Should have failed validation');
    } catch (error) {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /INVALID:/);
      assert.match(error.stderr, /missing required field/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('validates the root PORTFOLIO.json of this repository', async () => {
    const rootManifestPath = resolve('PORTFOLIO.json');
    const { stdout, stderr } = await execFileAsync('node', [JS_SCRIPT_PATH, rootManifestPath]);
    assert.match(stdout, /VALID:/);
    assert.equal(stderr, '');
  });
});


