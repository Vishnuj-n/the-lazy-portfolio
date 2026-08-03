#!/usr/bin/env node
/**
 * Validate a repository PORTFOLIO.json manifest using Node.js.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateManifest } from './fetch-projects.js';

export async function loadManifest(source) {
  if (source === '-') {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString('utf8');
    return JSON.parse(raw);
  }

  const raw = await readFile(resolve(source), 'utf8');
  return JSON.parse(raw);
}

export async function main(args = process.argv.slice(2)) {
  if (args.length > 1) {
    console.error('Usage: node scripts/validate-portfolio.js [PORTFOLIO.json|-]');
    return 2;
  }

  const source = args[0] || 'PORTFOLIO.json';

  let manifest;
  try {
    manifest = await loadManifest(source);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`ERROR: file not found: ${source}`);
      return 2;
    }
    if (error instanceof SyntaxError) {
      console.error(`INVALID: malformed JSON in ${source}: ${error.message}`);
      return 1;
    }
    console.error(`ERROR: could not read ${source}: ${error.message}`);
    return 2;
  }

  const errors = validateManifest(manifest);
  if (errors.length > 0) {
    console.error(`INVALID: ${source}`);
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    return 1;
  }

  console.log(`VALID: ${source}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().then((exitCode) => {
    process.exitCode = exitCode;
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
