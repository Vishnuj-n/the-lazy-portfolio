import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseTemplateBody } from '../../scripts/parse-issue.js';

const AI_TEMPLATE_PATH = resolve('.github/ISSUE_TEMPLATE/ai_intake.yml');
const CRED_TEMPLATE_PATH = resolve('.github/ISSUE_TEMPLATE/credential_intake.yml');
const EXP_TEMPLATE_PATH = resolve('.github/ISSUE_TEMPLATE/experience_intake.yml');

describe('Issue Templates Validation & Simulation', () => {
  it('verifies all issue templates exist and contain valid YAML structure', async () => {
    for (const path of [AI_TEMPLATE_PATH, CRED_TEMPLATE_PATH, EXP_TEMPLATE_PATH]) {
      const content = await readFile(path, 'utf8');
      expect(content).toContain('name:');
      expect(content).toContain('description:');
      expect(content).toContain('body:');
    }
  });

  it('simulates parser against credential_intake output format', () => {
    const simulatedGithubFormMarkdown = `### Action
Update

### Certification Title
Oracle Cloud Generative AI Professional

### Issuer
Oracle

### Slug
oracle

### Color
F80000`;

    const parsed = parseTemplateBody(simulatedGithubFormMarkdown);
    expect(parsed.action).toBe('update');
    expect(parsed.title).toBe('Oracle Cloud Generative AI Professional');
    expect(parsed.issuer).toBe('Oracle');
    expect(parsed.slug).toBe('oracle');
    expect(parsed.color).toBe('F80000');
  });

  it('simulates parser against experience_intake output format', () => {
    const simulatedGithubFormMarkdown = `### Action
Update

### Company / Organization Name
Ellipsonic

### Role / Position
Software Developer Intern

### Period
Mar 2026 – Jul 2026

### Location
Bengaluru, India

### Highlights (One per line)
- Engineered backend REST APIs in Nx monorepo.
- Automated Docker container workflows.`;

    const parsed = parseTemplateBody(simulatedGithubFormMarkdown);
    expect(parsed.action).toBe('update');
    expect(parsed.company).toBe('Ellipsonic');
    expect(parsed.role).toBe('Software Developer Intern');
    expect(parsed.period).toBe('Mar 2026 – Jul 2026');
    expect(parsed.location).toBe('Bengaluru, India');
    expect(parsed.highlights).toEqual([
      'Engineered backend REST APIs in Nx monorepo.',
      'Automated Docker container workflows.'
    ]);
  });
});
