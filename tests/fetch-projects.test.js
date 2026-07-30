import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  fetchPortfolioData,
  githubHeaders,
  resolveUsername,
  validateManifest,
} from '../scripts/fetch-projects.js';

function response(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

function manifest(overrides = {}) {
  return {
    title: 'Example project',
    summary: 'A sufficiently detailed and factual project summary for validation.',
    category: 'Developer tooling',
    date: '2026-07',
    tier: 2,
    priority: 50,
    techStack: ['Node.js'],
    ...overrides,
  };
}

function repo(name, overrides = {}) {
  return {
    name,
    default_branch: 'trunk',
    html_url: `https://github.com/owner/${name}`,
    stargazers_count: 4,
    forks_count: 2,
    license: { spdx_id: 'MIT' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    pushed_at: '2026-07-01T00:00:00Z',
    ...overrides,
  };
}

test('resolves username precedence and optional authentication headers', () => {
  assert.equal(resolveUsername({ GITHUB_USERNAME: 'first', VITE_GITHUB_USERNAME: 'second' }), 'first');
  assert.equal(resolveUsername({ VITE_GITHUB_USERNAME: 'second' }), 'second');
  assert.equal(resolveUsername({}), 'vishnuj-n');
  assert.equal(githubHeaders('secret').Authorization, 'Bearer secret');
  assert.equal(githubHeaders().Authorization, undefined);
});

test('validator mirrors manifest constraints and rejects unknown fields', () => {
  assert.deepEqual(validateManifest(manifest()), []);
  const errors = validateManifest(manifest({
    title: ' bad ',
    tier: true,
    techStack: ['Vue', 'vue'],
    media: { thumbnail: 'http://example.com/image.png', extra: 'x' },
    derived: true,
  }));
  assert.ok(errors.includes('title must not start or end with whitespace'));
  assert.ok(errors.includes('tier must be an integer from 1 to 3'));
  assert.ok(errors.includes('techStack[1] duplicates another techStack item'));
  assert.ok(errors.includes('media.extra is not an allowed field'));
  assert.ok(errors.includes('derived is not an allowed field'));
});

test('ingests paginated repositories, skips 404 and invalid manifests, then sorts deterministically', async () => {
  const calls = [];
  const firstRepos = [repo('later'), repo('missing')];
  const secondRepos = [repo('first'), repo('invalid')];
  const manifests = {
    later: manifest({ title: 'Zulu', date: '2025-01', priority: 80 }),
    first: manifest({ title: 'Alpha', date: '2026-02', priority: 80 }),
    invalid: manifest({ unknown: true }),
  };
  const fetchImpl = async (url, options) => {
    calls.push([url, options]);
    if (url.includes('/users/')) {
      return response(firstRepos, { headers: { link: '<https://api.github.test/page-2>; rel="next"' } });
    }
    if (url === 'https://api.github.test/page-2') return response(secondRepos);
    if (url.includes('/missing/contents/')) return response({ message: 'Not Found' }, { status: 404 });
    if (url.includes('/contents/')) {
      const name = url.match(/repos\/owner\/([^/]+)/)[1];
      return response({ type: 'file', encoding: 'base64', content: Buffer.from(JSON.stringify(manifests[name])).toString('base64') });
    }
    if (url.endsWith('/languages')) return response({ JavaScript: 120 });
    throw new Error(`Unexpected URL: ${url}`);
  };

  const projects = await fetchPortfolioData({
    username: 'owner', fetchImpl, write: false, logger: { warn() {} }, concurrency: 2,
  });
  assert.deepEqual(projects.map((project) => project.repoName), ['first', 'later']);
  assert.equal(projects[0].repositoryUrl, 'https://github.com/owner/first');
  assert.deepEqual(projects[0].languages, { JavaScript: 120 });
  assert.ok(calls.some(([url]) => url.includes('PORTFOLIO.json?ref=trunk')));
  assert.ok(!calls.some(([url]) => url.includes('/invalid/languages')));
});

test('preserves an existing valid dataset when repository listing fails', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-fetch-'));
  const outputPath = join(directory, 'projects.json');
  const existing = [{ title: 'Preserved' }];
  await writeFile(outputPath, JSON.stringify(existing));
  try {
    const projects = await fetchPortfolioData({
      outputPath,
      fetchImpl: async () => { throw new Error('network down'); },
      logger: { warn() {} },
    });
    assert.deepEqual(projects, existing);
    assert.deepEqual(JSON.parse(await readFile(outputPath, 'utf8')), existing);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('preserves an existing dataset when every repository inspection fails', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-fetch-'));
  const outputPath = join(directory, 'projects.json');
  const existing = [{ title: 'Preserved' }];
  await writeFile(outputPath, JSON.stringify(existing));
  try {
    const projects = await fetchPortfolioData({
      username: 'owner',
      outputPath,
      fetchImpl: async (url) => {
        if (url.includes('/users/')) return response([repo('one'), repo('two')]);
        throw new Error('API outage');
      },
      logger: { warn() {} },
    });
    assert.deepEqual(projects, existing);
    assert.deepEqual(JSON.parse(await readFile(outputPath, 'utf8')), existing);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('fails on total API failure when no valid dataset exists', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-fetch-'));
  try {
    await assert.rejects(fetchPortfolioData({
      outputPath: join(directory, 'projects.json'),
      fetchImpl: async () => { throw new Error('network down'); },
      logger: { warn() {} },
    }), /network down/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
