// Turns today's script (reels/<dir>/reel.json) into a Rakuda project the engine can edit, exactly as Rakuda's
// 「AIに全部おまかせ」 does (rakuda/web/lib/voice.ts speak + app/api/projects): the script read by ElevenLabs
// (eleven_v4, a Rakuda voice) as recording.mp3, the voice's own character timing as voice-timing.json, and
// project.json with the script, the voice, 台本のまま (asis) and 完成済みの音声 (polished), so the engine times the
// lines from the voice and never transcribes it.
//
// Hacozy additions: `yomi` in reel.json ({"Hacozy": "ハコジー"}) is what the voice says for a word while the captions
// keep the word (the reading's characters are swapped back in the timing, over the same time span); the Hacozy look
// (dark navy, blue accent, never green), no BGM, and the Hacozy app icon as a material for the ending.
//
//   node tools/project.mjs reels/<dir>     prints the project folder (rakuda/data/projects/<id>)
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const VOICES = { // rakuda/web/lib/voices.ts, Japanese
  Konoha: 'T7yYq3WpB94yAuOXraRi', Harune: 'c2XJrw7TvNGtOc6r0ijG', Akari: 'EkK6wL8GaH8IgBZTTDGJ', Satomi: 'wcs09USXSN5Bl7FXohVZ',
  Hinata: 'j210dv0vWm7fCknyQpbA', Otani: '3JDquces8E8bkmvbh6Bc', Asahi: 'GKDaBI8TKSBJVhsCLD6n', Mitsuwo: 'zdWu2I1sJrZsmxJG5rie',
};
const CHANNEL = '6c5e10a070d9'; // the Hacozy channel (@hacozy_official) whose learnings the engine follows
const YOMI = { Hacozy: 'ハコジー' }; // always; a reel adds its own in reel.json `yomi`
const LOOK = { // .agents/skills/hacozy-short-script (os repo): Hacozy dark, never green
  name: 'Hacozy dark',
  background: '#131f2b',
  ink: '#f1f7fb',
  accent: '#2e90d9',
  dark: true,
  describe: 'Hacozy dark: a deep navy ground (#131f2b), off-white text (#f1f7fb) and one clear blue accent (#2e90d9) for '
    + 'what matters (the key step, the answer, the number); gold (#f2b84b) only for an alarm or a failure. Never green. '
    + 'Real-looking mechanisms drawn straight on the ground, no cards or panels; crisp motion that explains.',
};

const reelDir = path.resolve(process.argv[2]);
const reel = JSON.parse(fs.readFileSync(path.join(reelDir, 'reel.json'), 'utf8'));
const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error('ELEVENLABS_API_KEY is not set');
const voice = VOICES[reel.voice ?? 'Konoha'];
if (!voice) throw new Error(`unknown voice ${reel.voice}; one of ${Object.keys(VOICES).join(', ')}`);
const script = reel.lines.map((l) => l.trim()).filter(Boolean).join('\n');
const yomi = { ...YOMI, ...(reel.yomi ?? {}) };
const words = Object.keys(yomi).sort((a, b) => b.length - a.length);
const spoken = words.reduce((s, w) => s.split(w).join(yomi[w]), script);

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
  method: 'POST',
  headers: { 'xi-api-key': key, 'content-type': 'application/json' },
  body: JSON.stringify({ text: spoken, model_id: 'eleven_v4', language_code: 'ja', voice_settings: { speed: 1.1 } }),
});
if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 400)}`);
const { audio_base64, alignment: al } = await res.json();
const round = (t) => Math.round(t * 1000) / 1000;
let chars = al.characters.map((c, k) => [c, round(al.character_start_times_seconds[k]), round(al.character_end_times_seconds[k])]);

// the reading back to the written word: walk the script, and where it has a word with a reading, the reading's
// characters in the voice's timing are replaced by the word's characters spread over the reading's time span
const out = [];
let i = 0; // position in chars (the spoken text)
for (let s = 0; s < script.length;) {
  const w = words.find((x) => script.startsWith(x, s));
  if (w) {
    const r = yomi[w];
    const span = chars.slice(i, i + r.length);
    if (span.map((c) => c[0]).join('') !== r) throw new Error(`timing does not line up at ${w} (${r})`);
    const a = span[0][1], b = span[span.length - 1][2];
    [...w].forEach((ch, k) => out.push([ch, round(a + ((b - a) * k) / w.length), round(a + ((b - a) * (k + 1)) / w.length)]));
    i += r.length; s += w.length;
  } else {
    if (chars[i]?.[0] !== script[s]) throw new Error(`timing does not line up at character ${s} (${script[s]} vs ${chars[i]?.[0]})`);
    out.push(chars[i]); i++; s++;
  }
}
chars = out;
const timing = { text: script, chars };

const id = crypto.randomUUID().slice(0, 12);
const dir = path.resolve('rakuda/data/projects', id);
fs.mkdirSync(path.join(dir, 'media'), { recursive: true });
fs.writeFileSync(path.join(dir, 'recording.mp3'), Buffer.from(audio_base64, 'base64'));
fs.writeFileSync(path.join(dir, 'voice-timing.json'), JSON.stringify(timing));
fs.copyFileSync('assets/hacozy-icon.png', path.join(dir, 'media', 'hacozy-icon.png'));
fs.writeFileSync(path.join(dir, 'materials.json'), JSON.stringify({
  items: [{ id: 'hacozy-icon', name: 'Hacozyアイコン.png', kind: 'image', file: 'hacozy-icon.png', w: 512, h: 512,
    note: 'Hacozyのアプリアイコン（カエル）。最後の「続きはHacozyで」の行でアプリとして添える。それ以外では使わない。' }],
  placed: [],
}, null, 1));
fs.writeFileSync(path.join(dir, 'project.json'), JSON.stringify({
  id, created: new Date().toISOString(), source: 'recording.mp3', lang: 'ja', channel: CHANNEL,
  script, asis: true, polished: true, voice, confirmed: true, instruction: reel.instruction ?? '',
  style: 'custom', look: LOOK, plugins: { bgm: false },
}, null, 2));
const seconds = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(dir, 'recording.mp3')]).toString());
fs.writeFileSync(path.join(reelDir, 'project'), id + '\n');
console.error(`voice ${seconds.toFixed(1)} s, ${reel.lines.length} lines → ${dir}`);
if (seconds > 100) throw new Error(`the voice runs ${seconds.toFixed(0)} s; a reel must stay under 100 s`);
console.log(dir);
