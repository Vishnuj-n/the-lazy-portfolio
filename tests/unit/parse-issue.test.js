import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { 
  extractImageUrls, 
  parseTemplateBody, 
  validateCertification, 
  validateExperience, 
  processIssueIntake 
} from '../../scripts/parse-issue.js';

const TEST_CERTS_PATH = resolve('tests/scratch_certs.json');
const TEST_EXP_PATH = resolve('tests/scratch_exp.json');

describe('Issue Intake Engine', () => {
  beforeEach(async () => {
    await writeFile(TEST_CERTS_PATH, '[]', 'utf8');
    await writeFile(TEST_EXP_PATH, '[]', 'utf8');
  });

  it('extracts markdown and raw image URLs', () => {
    const text = 'Check out this screenshot ![badge](https://example.com/badge.png) and attachment https://github.com/user-attachments/assets/12345';
    const urls = extractImageUrls(text);
    expect(urls).toContain('https://example.com/badge.png');
    expect(urls).toContain('https://github.com/user-attachments/assets/12345');
  });

  it('parses structured credential template body', () => {
    const body = `### Action
Create

### Certification Title
AWS Certified AI Practitioner

### Issuer
Amazon Web Services

### Slug
amazonwebservices

### Color
FF9900`;

    const parsed = parseTemplateBody(body);
    expect(parsed.action).toBe('create');
    expect(parsed.title).toBe('AWS Certified AI Practitioner');
    expect(parsed.issuer).toBe('Amazon Web Services');
    expect(parsed.slug).toBe('amazonwebservices');
    expect(parsed.color).toBe('FF9900');
  });

  it('validates certification fields', () => {
    expect(validateCertification({ title: 'AWS', issuer: 'Amazon' })).toEqual([]);
    expect(validateCertification({ title: 'A' })).toContain('Title must be at least 3 chars');
    expect(validateCertification({ title: 'AWS', issuer: 'A' })).toContain('Issuer must be at least 2 chars');
    expect(validateCertification({ title: 'AWS', issuer: 'Amazon', color: 'invalid' })).toContain('Color must be a valid hex string');
  });

  it('validates experience fields', () => {
    const valid = { company: 'Ellipsonic', role: 'Intern', period: '2026', highlights: ['Worked on REST APIs'] };
    expect(validateExperience(valid)).toEqual([]);
    expect(validateExperience({ role: 'Intern' })).toContain('Company/Organization must be specified');
  });

  it('processes credential template intake into JSON store', async () => {
    const body = `### Action\nCreate\n\n### Certification Title\nOracle Cloud Generative AI\n\n### Issuer\nOracle\n\n### Slug\noracle\n\n### Color\nF80000`;
    const result = await processIssueIntake({
      issueBody: body,
      issueLabels: ['intake:credential'],
      certPath: TEST_CERTS_PATH,
      expPath: TEST_EXP_PATH,
    });

    expect(result.type).toBe('certification');
    expect(result.data.title).toBe('Oracle Cloud Generative AI');

    const saved = JSON.parse(await readFile(TEST_CERTS_PATH, 'utf8'));
    expect(saved).toHaveLength(1);
    expect(saved[0].issuer).toBe('Oracle');
  });
});
