import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const API_ROOT = 'https://api.github.com';
const DEFAULT_OUTPUT = resolve('src/data/projects.json');
const DEFAULT_LOCAL_PROJECTS = resolve('src/data/local-projects.json');
import { validateManifest } from '../.agents/skills/add-to-portfolio/scripts/validate-portfolio.js';
export { validateManifest };

export async function loadLocalProjects(localPath = DEFAULT_LOCAL_PROJECTS) {
  try {
    const raw = await readFile(localPath, 'utf8');
    const data = JSON.parse(raw);
    const map = new Map();
    const list = Array.isArray(data) ? data : Object.values(data);
    for (const item of list) {
      if (item && item.repoName && typeof item.repoName === 'string') {
        const errors = validateManifest(item);
        if (errors.length === 0) {
          map.set(item.repoName.toLowerCase(), item);
        }
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

export function resolveUsername(env = process.env) {
  return env.GITHUB_USERNAME || env.VITE_GITHUB_USERNAME || 'vishnuj-n';
}

export function githubHeaders(token = process.env.GITHUB_PAT) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'zero-maintenance-portfolio',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function nextLink(linkHeader) {
  if (!linkHeader) return null;
  for (const part of linkHeader.split(',')) {
    const semicolonIdx = part.indexOf(';');
    if (semicolonIdx === -1) continue;
    const urlPart = part.slice(0, semicolonIdx).trim();
    const relPart = part.slice(semicolonIdx + 1).trim();
    if (relPart === 'rel="next"' && urlPart.startsWith('<') && urlPart.endsWith('>')) {
      return urlPart.slice(1, -1);
    }
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

async function parseRemoteManifest(response, repoName, logger) {
  if (response.status === 404) return null;
  if (!response.ok) throw await responseError(response);

  const content = await response.json();
  if (content?.type !== 'file' || content.encoding !== 'base64' || typeof content.content !== 'string') {
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(content.content.replace(/\s/g, ''), 'base64').toString('utf8'));
  } catch (error) {
    throw new Error(`PORTFOLIO.json is malformed JSON: ${error.message}`);
  }

  const errors = validateManifest(parsed);
  if (errors.length > 0) {
    logger.warn(`Skipping ${repoName}: invalid PORTFOLIO.json\n- ${errors.join('\n- ')}`);
    return null;
  }

  return parsed;
}

async function fetchRepoLanguages(owner, name, { fetchImpl, headers }) {
  try {
    const response = await fetchImpl(`${API_ROOT}/repos/${owner}/${name}/languages`, { headers });
    if (!response.ok) return {};
    const parsed = await response.json();
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {}
  return {};
}

async function fetchManifest(repo, username, options) {
  const { fetchImpl, headers, logger, localProjects = new Map() } = options;
  const owner = encodeURIComponent(username);
  const name = encodeURIComponent(repo.name);
  const ref = encodeURIComponent(repo.default_branch);
  const manifestUrl = `${API_ROOT}/repos/${owner}/${name}/contents/PORTFOLIO.json?ref=${ref}`;

  const response = await fetchImpl(manifestUrl, { headers });
  let manifest = await parseRemoteManifest(response, repo.name, logger);

  if (!manifest) {
    manifest = localProjects.get(repo.name.toLowerCase()) || null;
  }

  if (!manifest) return null;

  const languages = await fetchRepoLanguages(owner, name, { fetchImpl, headers });
  const cleanManifest = { ...manifest };
  delete cleanManifest.repoName;

  return {
    ...cleanManifest,
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
  localProjectsPath = DEFAULT_LOCAL_PROJECTS,
  localProjectsMap = null,
  concurrency = 6,
  logger = console,
  write = true,
} = {}) {
  const headers = githubHeaders(token);
  const localProjects = localProjectsMap || await loadLocalProjects(localProjectsPath);

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
  const fetchedProjects = await mapLimit(repos, Math.max(1, concurrency), async (repo) => {
    try {
      return await fetchManifest(repo, username, { fetchImpl, headers, logger, localProjects });
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

  const projects = fetchedProjects.filter(Boolean);

  // Include unmatched local projects (e.g. local-only repos or repos without remote manifests)
  const fetchedRepoNames = new Set(projects.map((p) => p.repoName.toLowerCase()));
  for (const [key, localManifest] of localProjects.entries()) {
    if (!fetchedRepoNames.has(key)) {
      const cleanManifest = { ...localManifest };
      delete cleanManifest.repoName;
      projects.push({
        ...cleanManifest,
        repoName: localManifest.repoName,
        repositoryUrl: `https://github.com/${username}/${localManifest.repoName}`,
        stars: 0,
        forks: 0,
        license: null,
        languages: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pushedAt: new Date().toISOString(),
      });
    }
  }

  const sorted = sortProjects(projects);
  if (write) await atomicWriteJson(outputPath, sorted);
  return sorted;
}

export async function main() {
  const projects = await fetchPortfolioData();
  console.log(`Wrote ${projects.length} project${projects.length === 1 ? '' : 's'} to ${DEFAULT_OUTPUT}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
