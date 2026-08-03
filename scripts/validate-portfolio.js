#!/usr/bin/env node
/**
 * Validate a repository PORTFOLIO.json manifest using Node.js.
 * Delegates execution to the single source of truth validator script inside the skill directory.
 */

import { main, validateManifest, loadManifest } from '../.agents/skills/add-to-portfolio/scripts/validate-portfolio.js';

export { validateManifest, loadManifest, main };

try {
  process.exitCode = await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
