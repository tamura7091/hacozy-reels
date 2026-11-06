// Picks today's candidates from the live Hacozy catalog (Supabase `courses` / `lessons`, read with the public key the
// web app ships): only published courses, never a lesson already in history.json, and the courses that went longest
// without a reel first (so the reels rotate across courses). Writes, for the script step:
//   REEL_DIR/candidates.json      the shortlist: course, its description, its unused lessons (title + description)
//   REEL_DIR/lessons/<id>.md      each candidate lesson's full text (title, description, every slide's words)
//
//   node tools/pick.mjs reels/<dir> [courses=4]
import fs from 'node:fs';
import path from 'node:path';

const [dirArg, nArg] = process.argv.slice(2);
const dir = path.resolve(dirArg);
const N = Number(nArg ?? 4);
const URL_ = process.env.HACOZY_SUPABASE_URL;
const KEY = process.env.HACOZY_SUPABASE_KEY;
if (!URL_ || !KEY) throw new Error('HACOZY_SUPABASE_URL / HACOZY_SUPABASE_KEY are not set');

async function rest(q) {
  const r = await fetch(`${URL_}/rest/v1/${q}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!r.ok) throw new Error(`Supabase ${q.split('?')[0]}: ${r.status} ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

const history = JSON.parse(fs.readFileSync('history.json', 'utf8'));
const usedLessons = new Set(history.map((h) => h.lesson_id).filter(Boolean));
const lastUse = {}; // course id → the latest date it had a reel
for (const h of history) if (h.course_id && (lastUse[h.course_id] ?? '') < h.date) lastUse[h.course_id] = h.date;

const courses = await rest('courses?select=id,title,description,topics&is_published=eq.true');
const lessons = await rest(`lessons?select=id,course_id,title,description,order,slides_v3,slides_v2,slides&course_id=in.(${courses.map((c) => c.id).join(',')})&order=course_id,order`);
const byCourse = {};
for (const l of lessons) if (!usedLessons.has(l.id)) (byCourse[l.course_id] ??= []).push(l);

// least recently used first (never used = oldest); ties in a random order so the same course does not always win
const open = courses.filter((c) => byCourse[c.id]?.length);
if (!open.length) throw new Error('every published lesson already has a reel');
open.sort((a, b) => (lastUse[a.id] ?? '').localeCompare(lastUse[b.id] ?? '') || Math.random() - 0.5);
const pick = open.slice(0, N);

// every human-readable string in a lesson's slides, in order (ids, urls, code identifiers and style values dropped)
const SKIP = new Set(['id', 'type', 'kind', 'url', 'src', 'image', 'icon', 'color', 'style', 'widget', 'component', 'layout', 'variant', 'key', 'audio']);
function words(v, out = []) {
  if (typeof v === 'string') {
    const s = v.trim();
    if (s && (/[぀-ヿ一-鿿]/.test(s) || s.split(' ').length > 3) && !/^https?:/.test(s)) out.push(s);
  } else if (Array.isArray(v)) v.forEach((x) => words(x, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!SKIP.has(k)) words(x, out);
  return out;
}

fs.mkdirSync(path.join(dir, 'lessons'), { recursive: true });
const shortlist = pick.map((c) => ({
  course_id: c.id,
  course_title: c.title,
  course_description: c.description,
  last_reel: lastUse[c.id] ?? null,
  lessons: byCourse[c.id].map((l) => {
    const body = [...new Set(words(l.slides_v3 ?? l.slides_v2 ?? l.slides))];
    fs.writeFileSync(path.join(dir, 'lessons', `${l.id}.md`), `# ${l.title}\n\ncourse: ${c.title} (${c.id}), lesson ${l.order}\n\n${l.description ?? ''}\n\n---\n\n${body.join('\n')}\n`);
    return { lesson_id: l.id, order: l.order, title: l.title, description: l.description, text: `lessons/${l.id}.md` };
  }),
}));
fs.writeFileSync(path.join(dir, 'candidates.json'), JSON.stringify(shortlist, null, 1));
console.log(`${courses.length} published courses, ${usedLessons.size} lessons already used; shortlist:`);
for (const c of shortlist) console.log(`- ${c.course_title} (${c.course_id}): ${c.lessons.length} unused lessons, last reel ${c.last_reel ?? 'never'}`);
