// What both accounts have already posted, read live from Instagram so reels uploaded by hand count too:
// @hacozy_official (IG_USER_ID) and @rakuda.studio (via the Rakuda Page; the same system user token reaches both,
// and Rakuda's reels were often Hacozy-style explainers). The script step never repeats a topic in this list.
//
//   node tools/posted.mjs reels/<dir>      writes REEL_DIR/posted.json and prints it
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://graph.facebook.com/v23.0';
const token = (process.env.IG_TOKEN ?? '').trim();
const igId = (process.env.IG_USER_ID ?? '').trim();
const RAKUDA_PAGE = '1324386664102091';
if (!token || !igId) throw new Error('IG_TOKEN and IG_USER_ID must both be set');

async function get(url) {
  const r = await fetch(url);
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(`${url.split('?')[0]}: ${r.status} ${JSON.stringify(j.error ?? j).slice(0, 300)}`);
  return j;
}
async function media(id) {
  const out = [];
  let url = `${API}/${id}/media?fields=caption,media_type,permalink,timestamp&limit=100&access_token=${token}`;
  while (url) {
    const j = await get(url);
    out.push(...j.data.map((m) => ({ date: m.timestamp.slice(0, 10), type: m.media_type, caption: (m.caption ?? '').slice(0, 300), permalink: m.permalink })));
    url = j.paging?.next;
  }
  return out;
}

const dir = path.resolve(process.argv[2]);
const { instagram_business_account: rakuda } = await get(`${API}/${RAKUDA_PAGE}?fields=instagram_business_account&access_token=${token}`);
const posted = {
  hacozy_official: await media(igId),
  'rakuda.studio': rakuda ? await media(rakuda.id) : [],
};
fs.writeFileSync(path.join(dir, 'posted.json'), JSON.stringify(posted, null, 1));
for (const [name, list] of Object.entries(posted)) {
  console.log(`@${name}: ${list.length} posts`);
  for (const m of list) console.log(`  ${m.date} ${m.caption.split('\n')[0].slice(0, 60)}`);
}
