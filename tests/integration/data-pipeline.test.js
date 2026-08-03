import { describe, it, expect } from 'vitest';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Data Pipeline Integration', () => {
  const outputPath = path.join(process.cwd(), 'src', 'data', 'projects.json');

  it('should verify output file structure and contents after data ingestion', () => {
    assert.ok(fs.existsSync(outputPath), 'src/data/projects.json must exist');
    const content = fs.readFileSync(outputPath, 'utf8');
    const data = JSON.parse(content);

    assert.ok(Array.isArray(data), 'src/data/projects.json must contain an array of projects');

    // Verify schema structure for project items
    data.forEach((project) => {
      assert.ok(project.title, 'Project must have a title');
      assert.ok(project.summary, 'Project must have a summary');
      assert.ok(Array.isArray(project.techStack), 'techStack must be an array');
      assert.ok(project.repositoryUrl, 'Project must have a repositoryUrl');
    });
  });
});
