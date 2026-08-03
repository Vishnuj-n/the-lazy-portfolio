#!/usr/bin/env node
/**
 * Validate a repository PORTFOLIO.json manifest using Node.js.
 * Self-contained CLI validator inside .agents/skills/add-to-portfolio/scripts/
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const REQUIRED_FIELDS = new Set([
  'title', 'summary', 'category', 'date', 'tier', 'priority', 'techStack',
]);
const OPTIONAL_FIELDS = new Set(['highlights', 'media', 'links']);
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function validateString(value, field, errors, minimum, maximum) {
  if (typeof value !== 'string') {
    errors.push(`${field} must be a string`);
    return;
  }
  if (value !== value.trim()) errors.push(`${field} must not start or end with whitespace`);
  if (value.length < minimum || value.length > maximum) {
    errors.push(`${field} must contain ${minimum} to ${maximum} characters`);
  }
}

function validateStringArray(value, field, errors, minimum, maximum, itemMinimum, itemMaximum) {
  if (!Array.isArray(value)) {
    errors.push(`${field} must be an array`);
    return;
  }
  if (value.length < minimum || value.length > maximum) {
    errors.push(`${field} must contain ${minimum} to ${maximum} items`);
  }
  const normalizedItems = new Set();
  value.forEach((item, index) => {
    const itemField = `${field}[${index}]`;
    validateString(item, itemField, errors, itemMinimum, itemMaximum);
    if (typeof item === 'string') {
      const normalized = item.trim().toLocaleLowerCase('en-US');
      if (normalizedItems.has(normalized)) {
        errors.push(`${itemField} duplicates another ${field} item`);
      }
      normalizedItems.add(normalized);
    }
  });
}

function validateHttpsUrl(value, field, errors) {
  if (typeof value !== 'string' || !value) {
    errors.push(`${field} must be a non-empty HTTPS URL`);
    return;
  }
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) {
      errors.push(`${field} must be an absolute HTTPS URL without credentials`);
    }
  } catch {
    errors.push(`${field} must be an absolute HTTPS URL without credentials`);
  }
}

function validateUrlGroup(value, field, allowedFields, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${field} must be an object`);
    return;
  }
  const fields = Object.keys(value);
  if (fields.length === 0) {
    errors.push(`${field} must be omitted when it has no values`);
    return;
  }
  fields.filter((key) => !allowedFields.has(key)).sort().forEach((key) => {
    errors.push(`${field}.${key} is not an allowed field`);
  });
  fields.filter((key) => allowedFields.has(key)).sort().forEach((key) => {
    validateHttpsUrl(value[key], `${field}.${key}`, errors);
  });
}

export function validateManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return ['manifest root must be a JSON object'];
  }

  const errors = [];
  const fields = new Set(Object.keys(manifest).filter((key) => key !== 'repoName'));
  [...REQUIRED_FIELDS].filter((field) => !fields.has(field)).sort().forEach((field) => {
    errors.push(`missing required field: ${field}`);
  });
  [...fields].filter((field) => !REQUIRED_FIELDS.has(field) && !OPTIONAL_FIELDS.has(field))
    .sort().forEach((field) => errors.push(`${field} is not an allowed field`));

  if (fields.has('title')) validateString(manifest.title, 'title', errors, 2, 80);
  if (fields.has('summary')) validateString(manifest.summary, 'summary', errors, 40, 500);
  if (fields.has('category')) validateString(manifest.category, 'category', errors, 2, 80);
  if (fields.has('date') && (typeof manifest.date !== 'string' || !DATE_PATTERN.test(manifest.date))) {
    errors.push('date must use YYYY-MM format with a valid month');
  }
  if (fields.has('tier') && (!Number.isInteger(manifest.tier) || ![1, 2, 3].includes(manifest.tier))) {
    errors.push('tier must be an integer from 1 to 3');
  }
  if (fields.has('priority') && (!Number.isInteger(manifest.priority)
      || manifest.priority < 0 || manifest.priority > 100)) {
    errors.push('priority must be an integer from 0 to 100');
  }
  if (fields.has('techStack')) {
    validateStringArray(manifest.techStack, 'techStack', errors, 1, 12, 1, 50);
  }
  if (fields.has('highlights')) {
    validateStringArray(manifest.highlights, 'highlights', errors, 1, 6, 10, 200);
  }
  if (fields.has('media')) {
    validateUrlGroup(manifest.media, 'media', new Set(['thumbnail', 'videoDemo']), errors);
  }
  if (fields.has('links')) {
    validateUrlGroup(manifest.links, 'links', new Set(['live', 'documentation']), errors);
  }
  return errors;
}

export async function loadManifest(filePath) {
  const targetPath = resolve(filePath);
  const raw = await readFile(targetPath, 'utf8');
  return JSON.parse(raw);
}

export async function main(args = process.argv.slice(2)) {
  if (args.length > 1) {
    console.error('Usage: node validate-portfolio.js [path/to/PORTFOLIO.json]');
    return 2;
  }

  const filePath = args[0] || 'PORTFOLIO.json';

  let manifest;
  try {
    manifest = await loadManifest(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`ERROR: file not found: ${filePath}`);
      return 2;
    }
    if (error instanceof SyntaxError) {
      console.error(`INVALID: malformed JSON in ${filePath}: ${error.message}`);
      return 1;
    }
    console.error(`ERROR: could not read ${filePath}: ${error.message}`);
    return 2;
  }

  const errors = validateManifest(manifest);
  if (errors.length > 0) {
    console.error(`INVALID: ${filePath}`);
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    return 1;
  }

  console.log(`VALID: ${filePath}`);
  return 0;
}


