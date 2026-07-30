import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const API_ROOT = 'https://api.github.com';
const DEFAULT_OUTPUT = resolve('src/data/projects.json');
const REQUIRED_FIELDS = new Set([
  'title', 'summary', 'category', 'date', 'tier', 'priority', 'techStack',
]);
const OPTIONAL_FIELDS = new Set(['highlights', 'media', 'links']);
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function resolveUsername(env = process.env) {
  return env.GITHUB_USERNAME || env.VITE_GITHUB_USERNAME || 'vishnuj-n';
}

import { readFileSync } from 'node:fs';

export function githubHeaders(token = process.env.GITHUB_PAT) {
  let finalToken = token;
  if (!finalToken) {
    try {
      const envContent = readFileSync(resolve('.env'), 'utf8');
      const match = envContent.match(/GITHUB_PAT=(.*)/);
      if (match?.[1]) finalToken = match[1].trim();
    } catch {}
  }
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'zero-maintenance-portfolio',
  };
  if (finalToken) headers.Authorization = `Bearer ${finalToken}`;
  return headers;
}

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
  const fields = new Set(Object.keys(manifest));
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

function nextLink(linkHeader) {
  if (!linkHeader) return null;
  for (const part of linkHeader.split(',')) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match?.[2] === 'next') return match[1];
  }
  return null;
}

async function responseError(response) {
  let detail = '';
  try {
    const body = await response.json();
    detail = body?.message ? `: ${body.message}` : '';
  } catch {
    // The status is sufficient when GitHub does not return JSON.
  }
  return new Error(`GitHub API request failed (${response.status} ${response.statusText})${detail}`);
}

export async function fetchPaginated(url, { fetchImpl = fetch, headers = githubHeaders() } = {}) {
  const items = [];
  let next = url;
  while (next) {
    const response = await fetchImpl(next, { headers });
    if (!response.ok) throw await responseError(response);
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error('GitHub pagination response was not an array');
    items.push(...page);
    next = nextLink(response.headers.get('link'));
  }
  return items;
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function fetchManifest(repo, username, options) {
  const { fetchImpl, headers, logger } = options;
  const owner = encodeURIComponent(username);
  const name = encodeURIComponent(repo.name);
  const ref = encodeURIComponent(repo.default_branch);
  const manifestUrl = `${API_ROOT}/repos/${owner}/${name}/contents/PORTFOLIO.json?ref=${ref}`;
  const response = await fetchImpl(manifestUrl, { headers });
  if (response.status === 404) return null;
  if (!response.ok) throw await responseError(response);
  const content = await response.json();
  if (content?.type !== 'file' || content.encoding !== 'base64' || typeof content.content !== 'string') {
    throw new Error('PORTFOLIO.json Contents API response was not a base64 file');
  }

  let manifest;
  try {
    manifest = JSON.parse(Buffer.from(content.content.replace(/\s/g, ''), 'base64').toString('utf8'));
  } catch (error) {
    throw new Error(`PORTFOLIO.json is malformed JSON: ${error.message}`);
  }
  const errors = validateManifest(manifest);
  if (errors.length) {
    logger.warn(`Skipping ${repo.name}: invalid PORTFOLIO.json\n- ${errors.join('\n- ')}`);
    return null;
  }

  const languagesResponse = await fetchImpl(`${API_ROOT}/repos/${owner}/${name}/languages`, { headers });
  if (!languagesResponse.ok) throw await responseError(languagesResponse);
  const languages = await languagesResponse.json();
  if (!languages || typeof languages !== 'object' || Array.isArray(languages)) {
    throw new Error('GitHub languages response was not an object');
  }

  return {
    ...manifest,
    repoName: repo.name,
    repositoryUrl: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    license: repo.license?.spdx_id ?? repo.license?.name ?? null,
    languages,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
  };
}

export function sortProjects(projects) {
  return projects.sort((a, b) => b.priority - a.priority
    || b.date.localeCompare(a.date)
    || a.title.localeCompare(b.title, 'en')
    || a.repoName.localeCompare(b.repoName, 'en'));
}

export async function atomicWriteJson(filePath, value) {
  await mkdir(dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await rename(temporaryPath, filePath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

export async function hasValidDataset(filePath) {
  try {
    const data = JSON.parse(await readFile(filePath, 'utf8'));
    return Array.isArray(data)
      && data.every((project) => project && typeof project === 'object' && !Array.isArray(project));
  } catch {
    return false;
  }
}

export async function fetchPortfolioData({
  username = resolveUsername(),
  token = process.env.GITHUB_PAT,
  fetchImpl = fetch,
  outputPath = DEFAULT_OUTPUT,
  concurrency = 6,
  logger = console,
  write = true,
} = {}) {
  const headers = githubHeaders(token);
  const reposUrl = `${API_ROOT}/users/${encodeURIComponent(username)}/repos?type=owner&sort=full_name&per_page=100`;
  let repos;
  try {
    repos = await fetchPaginated(reposUrl, { fetchImpl, headers });
  } catch (error) {
    if (await hasValidDataset(outputPath)) {
      logger.warn(`GitHub API unavailable; preserving existing project dataset: ${error.message}`);
      return JSON.parse(await readFile(outputPath, 'utf8'));
    }
    throw error;
  }

  let failedInspections = 0;
  let firstInspectionError;
  const projects = await mapLimit(repos, Math.max(1, concurrency), async (repo) => {
    try {
      return await fetchManifest(repo, username, { fetchImpl, headers, logger });
    } catch (error) {
      failedInspections += 1;
      firstInspectionError ??= error;
      logger.warn(`Skipping ${repo.name}: ${error.message}`);
      return null;
    }
  });
  if (repos.length > 0 && failedInspections === repos.length) {
    if (await hasValidDataset(outputPath)) {
      logger.warn('All repository inspections failed; preserving existing project dataset');
      return JSON.parse(await readFile(outputPath, 'utf8'));
    }
    throw firstInspectionError;
  }
  const sorted = sortProjects(projects.filter(Boolean));
  if (write) await atomicWriteJson(outputPath, sorted);
  return sorted;
}

export async function main() {
  const projects = await fetchPortfolioData();
  console.log(`Wrote ${projects.length} project${projects.length === 1 ? '' : 's'} to ${DEFAULT_OUTPUT}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
