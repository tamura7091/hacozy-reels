// Posts a finished reel to the @hacozy_official Instagram through the Instagram Graph API, uploading the mp4 itself
// (resumable upload), so no public hosting is needed. Works with either kind of token: an Instagram Login token
// (IGAA…, graph.instagram.com) or a Facebook Login / system user token (EAA…, graph.facebook.com). IG_USER_ID is the
// account's Instagram user id; the account's username must be hacozy_official or nothing is sent.
//
// It fails loudly: any error exits non-zero, and a post counts only once Instagram returns the published reel's
// permalink. The workflow opens an issue when a run that should have posted did not.
//
//   node tools/post.mjs reels/<dir>              check the token, the account and every file a post needs, and stop
//   node tools/post.mjs reels/<dir> --publish    … and publish reel.mp4 with caption.txt, record it in history.json
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const VERSION = 'v23.0';
const USERNAME = 'hacozy_official';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const publish = args.includes('--publish');
const token = (process.env.IG_TOKEN ?? '').trim();
const igId = (process.env.IG_USER_ID ?? '').trim();
if (!token || !igId) throw new Error('IG_TOKEN and IG_USER_ID must both be set');
const API = `https://graph.${token.startsWith('IG') ? 'instagram' : 'facebook'}.com/${VERSION}`;

async function api(method, url, params = {}) {
  const u = new URL(API + url);
  const opts = { method };
  params = { ...params, access_token: token };
  if (method === 'GET') for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  else opts.body = new URLSearchParams(params);
  const r = await fetch(u, opts);
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(`${method} ${u.pathname}: ${r.status} ${JSON.stringify(j.error ?? j).slice(0, 400)}`);
  return j;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function twice(what, fn) { // one retry after a minute: Meta's upload and publish fail now and then for no reason
  try { return await fn(); } catch (e) { console.log(`${what} failed (${e.message}); trying again in 60 s`); await wait(60000); return fn(); }
}

// 1. everything a post needs, checked before anything is sent (a dry run proves the post step would work)
const dir = path.resolve(args[0]);
const video = path.join(dir, 'reel.mp4');
const size = fs.existsSync(video) ? fs.statSync(video).size : 0;
if (size < 100000) throw new Error(`${video} is missing or empty`);
const caption = fs.readFileSync(path.join(dir, 'caption.txt'), 'utf8').trim();
if (!caption) throw new Error('caption.txt is empty');
if (!caption.includes('プロフィール')) throw new Error('caption.txt has no install CTA (プロフィールのリンク)');
const reel = JSON.parse(fs.readFileSync(path.join(dir, 'reel.json'), 'utf8'));
const me = await api('GET', `/${igId}`, { fields: 'username' });
if (me.username !== USERNAME) throw new Error(`the token posts as @${me.username}, not @${USERNAME}`);
console.log(`posting as @${me.username} via ${new URL(API).host}: ${(size / 1e6).toFixed(1)} MB, caption ${caption.length} chars`);
if (!publish) process.exit(0);

// 2. a reel container, the mp4 uploaded into it, then published once Instagram has processed it
async function container() {
  const box = await api('POST', `/${igId}/media`, { media_type: 'REELS', upload_type: 'resumable', caption, share_to_feed: 'true' });
  // rupload sometimes answers "ProcessingFailedError" although the bytes arrived (the container still turns FINISHED),
  // so an upload error is only logged and the container status decides
  const up = JSON.parse(execFileSync('curl', ['-s', '-X', 'POST',
    box.uri ?? `https://rupload.facebook.com/ig-api-upload/${VERSION}/${box.id}`,
    '-H', `Authorization: OAuth ${token}`, '-H', 'offset: 0', '-H', `file_size: ${size}`,
    '--data-binary', `@${video}`], { encoding: 'utf8', maxBuffer: 1 << 20 }) || '{}');
  if (!up.success) console.log(`upload answered ${JSON.stringify(up).slice(0, 300)}; checking the container`);
  for (let i = 0; ; i++) {
    const { status_code, status } = await api('GET', `/${box.id}`, { fields: 'status_code,status' });
    if (status_code === 'FINISHED') return box.id;
    if (status_code === 'ERROR' || status_code === 'EXPIRED' || i > 60) throw new Error(`processing: ${status_code} ${status ?? ''}`);
    await wait(10000);
  }
}
const ready = await twice('upload', container);
const { id } = await twice('publish', () => api('POST', `/${igId}/media_publish`, { creation_id: ready }));
const { permalink } = await api('GET', `/${id}`, { fields: 'permalink' });
if (!permalink) throw new Error(`published ${id} but Instagram returns no permalink for it`);
console.log(`published ${permalink}`);

const histFile = path.join(root, 'history.json');
const history = JSON.parse(fs.readFileSync(histFile, 'utf8'));
history.push({
  date: new Date().toISOString().slice(0, 10), slug: path.basename(dir), title: reel.title, topic: reel.topic,
  course_id: reel.course_id, lesson_id: reel.lesson_id, media_id: id, permalink,
});
fs.writeFileSync(histFile, JSON.stringify(history, null, 1) + '\n');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Posted: ${permalink}\n`);
