import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  normalizeGoogleDriveUrl,
  verifyAsset,
  verifyAssetsFile,
  verifyProjectAssets,
} from '../scripts/verify-assets.js';

function assetResponse(contentType, status = 200) {
  return new Response(null, { status, headers: { 'content-type': contentType } });
}

test('normalizes Google Drive file, open, and uc links', () => {
  const expected = 'https://drive.google.com/uc?export=download&id=abc123';
  assert.equal(normalizeGoogleDriveUrl('https://drive.google.com/file/d/abc123/view?usp=sharing'), expected);
  assert.equal(normalizeGoogleDriveUrl('https://drive.google.com/open?id=abc123'), expected);
  assert.equal(normalizeGoogleDriveUrl('https://drive.google.com/uc?id=abc123&export=view'), expected);
  assert.equal(normalizeGoogleDriveUrl('https://example.com/image.png'), 'https://example.com/image.png');
});

test('uses GET fallback and enforces media content types', async () => {
  const methods = [];
  const valid = await verifyAsset('https://example.com/image', 'image', {
    fetchImpl: async (_url, options) => {
      methods.push(options.method);
      return options.method === 'HEAD'
        ? assetResponse('text/plain', 405)
        : assetResponse('image/webp');
    },
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(methods, ['HEAD', 'GET']);

  const invalid = await verifyAsset('https://example.com/demo', 'video', {
    fetchImpl: async () => assetResponse('text/html'),
  });
  assert.equal(invalid.valid, false);
});

test('accepts successful Drive video responses without a video content type', async () => {
  const result = await verifyAsset('https://drive.google.com/file/d/demo-id/view', 'video', {
    fetchImpl: async () => assetResponse('application/octet-stream'),
  });
  assert.equal(result.valid, true);
  assert.equal(result.url, 'https://drive.google.com/uc?export=download&id=demo-id');
});

test('removes invalid optional media and empty media objects without dropping projects', async () => {
  const projects = [
    { repoName: 'one', media: { thumbnail: 'https://assets.test/nope', videoDemo: 'https://assets.test/demo' } },
    { repoName: 'two', media: { thumbnail: 'https://assets.test/nope' } },
    { repoName: 'three' },
  ];
  const verified = await verifyProjectAssets(projects, {
    fetchImpl: async (url) => url.endsWith('/demo')
      ? assetResponse('video/mp4')
      : assetResponse('text/html'),
    logger: { warn() {} },
  });
  assert.deepEqual(verified[0].media, { videoDemo: 'https://assets.test/demo' });
  assert.equal('media' in verified[1], false);
  assert.equal('media' in verified[2], false);
});

test('atomically rewrites a projects file after verification', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-assets-'));
  const projectsPath = join(directory, 'projects.json');
  await writeFile(projectsPath, JSON.stringify([{ title: 'One', media: { thumbnail: 'https://bad.test/image' } }]));
  try {
    await verifyAssetsFile({
      projectsPath,
      fetchImpl: async () => assetResponse('text/html'),
      logger: { warn() {} },
    });
    assert.deepEqual(JSON.parse(await readFile(projectsPath, 'utf8')), [{ title: 'One' }]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
