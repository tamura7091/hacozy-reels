// Gemini's naturalness pass over the draft script (Naoki: Gemini writes far more natural Japanese than Claude).
// Reads REEL_DIR/reel.json `lines`, asks Gemini to rewrite each line as a native Japanese explainer would say it,
// with every fact, number, name and the line order kept, and writes the result to REEL_DIR/polish.json
// ({lines, changed}). The script step's finalize pass then checks every changed line against the facts and decides.
// The fixed ending (the last two lines) is never sent for rewriting.
//
//   node tools/polish.mjs reels/<dir>
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.argv[2]);
const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error('GEMINI_API_KEY is not set');
const reel = JSON.parse(fs.readFileSync(path.join(dir, 'reel.json'), 'utf8'));
const FIXED = 2;
const body = reel.lines.slice(0, -FIXED);

const prompt = `あなたは日本語ネイティブの、落ち着いた解説系ショート動画のナレーターです。
次の台本は、別のAIが書いた下書きで、翻訳調・説明書調で不自然なところがあります。
ネイティブの先生が声に出して話すときの自然な日本語に、1行ずつ書き直してください。

守ること:
- 事実、数字、固有名詞、例、行の順番は1つも変えない。情報を足さない、削らない。
- 行の数は同じ（${body.length}行）。1行は1つのフレーズで、「、」か「。」で終わる。
- です／ます調。落ち着いた説明の語り口。「なんです」「なんと」「〜わけです」は使わない。ダッシュ（—）は使わない。
- 1行目は視聴者の好奇心をあおる行。答えを先に言わない。
- 「」で囲まれた用語は「」のまま残す。

例:
前: 「この方法は、データを効率的に処理することを可能にします。」
後: 「こうすると、データを速く処理できます。」
前: 「それは、私たちが毎日使用しているものです。」
後: 「私たちが毎日使っているものです。」

出力は JSON の文字列配列だけ（${body.length}要素）。

台本:
${body.map((l, i) => `${i + 1}. ${l}`).join('\n')}`;

async function ask(model, ms) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      signal: ctl.signal,
      headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json' } }),
    });
    if (!r.ok) throw new Error(`${model} ${r.status}: ${(await r.text()).slice(0, 300)}`);
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
    const lines = JSON.parse(text);
    if (!Array.isArray(lines) || lines.length !== body.length || lines.some((l) => typeof l !== 'string' || !l.trim()))
      throw new Error(`${model} returned ${Array.isArray(lines) ? lines.length : typeof lines} lines, not ${body.length}`);
    return lines.map((l) => l.trim().replace(/^\d+\.\s*/, ''));
  } finally {
    clearTimeout(timer);
  }
}

// gemini-pro-latest (thinking on) writes the most natural Japanese but sometimes hangs for minutes: give it 4
let lines, model;
for (const [m, ms] of [['gemini-pro-latest', 240000], ['gemini-3.8-flash', 120000]]) {
  try { lines = await ask(m, ms); model = m; break; } catch (e) { console.log(`${m}: ${e.message}`); }
}
if (!lines) throw new Error('Gemini gave no usable rewrite');
const all = [...lines, ...reel.lines.slice(-FIXED)];
const changed = all.filter((l, i) => l !== reel.lines[i]).length;
fs.writeFileSync(path.join(dir, 'polish.json'), JSON.stringify({ model, changed, lines: all }, null, 1));
console.log(`${model} changed ${changed} of ${body.length} lines`);
all.forEach((l, i) => l !== reel.lines[i] && console.log(`- ${reel.lines[i]}\n+ ${l}`));
