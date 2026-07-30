import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { atomicWriteJson } from './fetch-projects.js';

const DEFAULT_PROJECTS_PATH = resolve('src/data/projects.json');

export function normalizeGoogleDriveUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return value;
  }
  if (url.hostname !== 'drive.google.com') return value;

  const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
  const id = fileMatch?.[1] || url.searchParams.get('id');
  if (!id || (!fileMatch && !['/open', '/uc'].includes(url.pathname))) return value;
  const normalized = new URL('https://drive.google.com/uc');
  normalized.searchParams.set('export', 'download');
  normalized.searchParams.set('id', id);
  return normalized.href;
}

export function isGoogleDriveUrl(value) {
  try {
    return new URL(value).hostname === 'drive.google.com';
  } catch {
    return false;
  }
}

function acceptableResponse(response, kind, url) {
  if (!response.ok) return false;
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  if (kind === 'image') return contentType.startsWith('image/');
  return contentType.startsWith('video/') || isGoogleDriveUrl(url);
}

async function requestAsset(url, method, fetchImpl, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: method === 'GET' ? { Range: 'bytes=0-0' } : undefined,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function verifyAsset(url, kind, {
  fetchImpl = fetch,
  timeoutMs = 10_000,
} = {}) {
  const normalizedUrl = normalizeGoogleDriveUrl(url);
  try {
    const head = await requestAsset(normalizedUrl, 'HEAD', fetchImpl, timeoutMs);
    if (acceptableResponse(head, kind, normalizedUrl)) return { valid: true, url: normalizedUrl };
  } catch {
    // Hosts commonly reject HEAD; retry with a small ranged GET.
  }
  try {
    const get = await requestAsset(normalizedUrl, 'GET', fetchImpl, timeoutMs);
    const valid = acceptableResponse(get, kind, normalizedUrl);
    get.body?.cancel?.().catch?.(() => {});
    return { valid, url: normalizedUrl };
  } catch {
    return { valid: false, url: normalizedUrl };
  }
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

export async function verifyProjectAssets(projects, {
  fetchImpl = fetch,
  timeoutMs = 10_000,
  concurrency = 6,
  logger = console,
} = {}) {
  if (!Array.isArray(projects)) throw new Error('projects.json must contain an array');

  return mapLimit(projects, Math.max(1, concurrency), async (project) => {
    if (!project.media || typeof project.media !== 'object' || Array.isArray(project.media)) {
      return project;
    }
    const media = { ...project.media };
    for (const [field, kind] of [['thumbnail', 'image'], ['videoDemo', 'video']]) {
      if (!(field in media)) continue;
      const result = await verifyAsset(media[field], kind, { fetchImpl, timeoutMs });
      if (result.valid) {
        media[field] = result.url;
      } else {
        logger.warn(`Removing invalid ${field} from ${project.repoName || project.title || 'project'}`);
        delete media[field];
      }
    }
    const updated = { ...project };
    if (Object.keys(media).length) updated.media = media;
    else delete updated.media;
    return updated;
  });
}

export async function verifyAssetsFile({
  projectsPath = DEFAULT_PROJECTS_PATH,
  fetchImpl = fetch,
  timeoutMs = 10_000,
  concurrency = 6,
  logger = console,
} = {}) {
  const projects = JSON.parse(await readFile(projectsPath, 'utf8'));
  const verified = await verifyProjectAssets(projects, {
    fetchImpl, timeoutMs, concurrency, logger,
  });
  await atomicWriteJson(projectsPath, verified);
  return verified;
}

export async function main() {
  const projects = await verifyAssetsFile();
  console.log(`Verified media for ${projects.length} project${projects.length === 1 ? '' : 's'}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
