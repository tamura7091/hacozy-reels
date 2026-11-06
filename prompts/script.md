# Today's Hacozy reel: lesson and script

You write today's Japanese reel for the **@hacozy_official** Instagram. Hacozy is a learning app for adults: short
courses built from real primary sources (university lectures, books, papers, real code), a few minutes a day on the
phone. Each reel teaches one idea from one real Hacozy lesson so well that the viewer wants the next one, and the
course is where the next one is. The account's bio links to the app. **We only post super high quality reels**:
the bar is 1M views. A reel that would not stop a scrolling thumb is worse than no reel.

After you, Gemini polishes the Japanese, then the real Rakuda engine (checked out read-only at `rakuda/`) reads the
script with an AI voice, plans, designs, builds and checks every visual, and renders the video. Your job is the part
that decides whether it spreads: the lesson, the hook and the script. Work in `REEL_DIR` (given below). Never stop to
ask; nobody is watching. Be efficient: this whole step should take well under 20 minutes.

## 1. Pick the lesson

`REEL_DIR/candidates.json` is today's shortlist from the live catalog: published courses that went longest without a
reel, each with its lessons that have never had one. `REEL_DIR/lessons/<id>.md` is each lesson's full text. Also read:
- `REEL_DIR/posted.json`: every reel already on @hacozy_official and @rakuda.studio, read live from Instagram
  (including the ones Naoki made by hand: Apollo 11, image generation AI, GPS, vectors, Google Maps, the double slit,
  sorting, ChatGPT, black holes, Suica, the iPhone keyboard…). **Never repeat a topic or a close variant of one**,
  even from a different angle: a lesson whose main idea is already a posted reel is not eligible, so pick another
  lesson (or another course in the shortlist);
- `history.json`: what this pipeline posted, with the lesson ids;
- `rakuda/data/channels/6c5e10a070d9/channel.json` → `learnings`: what has worked on this very account (views per
  reel). Strong defaults: the first 3 seconds show the phenomenon itself moving; known products, famous experiments
  and CS classics beat abstract life advice.

Pick the one lesson with the strongest "wait, how?" for a Japanese adult on the train, whose idea animates well (a
mechanism, a process, an experiment, a surprising number that grows or flips). A lesson that is only advice, a
definition list, or app-specific UI is a weak reel: pick another. Write the 3 best candidates with one line each on
why they would spread, and say which won and why in `why`.

## 2. Check the facts

The lesson is your outline, not your proof. Every number, name and claim in the script comes from a page you read:
**English primary sources only** (the paper, the lecture's own page, the standards body, the company's own blog or
docs, the original book's publisher page, universities). Never Japanese re-reporting, video sites, content farms or
pirated books. List them in `sources`. If you cannot verify a claim, cut it.

## 3. Write the script

Follow the Hacozy short script rules in `rules/hacozy-short-script.md` (Naoki's rules from rewriting real scripts; the
"Steps" and "AI-voice reels" parts there are for a person in the editor and do not apply), and the system prompt of
`scriptTurn` in `rakuda/web/lib/viral.ts` (how Rakuda writes a voiceover). The most important:
- **Line 1 builds curiosity and never answers it**: the title or a striking, literally true result whose cause is
  still a mystery (a paradox is strongest). Line 2 asks the viewer's question the video answers. Name the concrete
  thing the editor can show moving at once, never an abstraction.
- One flow, no ステップ headings: problem → what we do → a familiar Japanese example → the next gap. Every line
  answers the gap the previous line left open. If two lines could swap places, the link is missing.
- The mechanism in precise plain words a tired adult follows with no school maths; each term in 「」 explained in the
  same sentence; no spec numbers or formulas that don't change understanding.
- です／ます, calm written narration. No 「なんです」「なんと」「〜わけです」. No em dashes.
- 14-20 lines, one phrase per line, each ending in 、 or 。, about 60-80 seconds read aloud (the voice reads about
  6 characters a second with pauses: 400-500 characters in all, never over 560).
- **The ending is not an ad.** The story's last beat opens the next question the video naturally raises, one this
  course's own lessons answer (check the lesson list in candidates.json). Then exactly these three lines, with the
  real course title from candidates.json:
  「その答えは、Hacozyのコース「<course_title>」で解説しています。」
  「続きはHacozyで。」
  「プロフィールのリンクからインストールしてね。」
  Never 「大人の学び直しアプリ」 or 「興味のある方は」.

Read it aloud in your head as the viewer: cut every line that does not earn its place, sharpen every word. Judge it
against 1M views and rewrite until you would bet on it.

## 4. Write `REEL_DIR/reel.json`

```json
{
  "course_id": "from candidates.json",
  "course_title": "from candidates.json",
  "lesson_id": "from candidates.json",
  "lesson_title": "from candidates.json",
  "title": "the reel's topic as the top label, e.g. 画像生成AIの仕組み (the topic, never the course name)",
  "topic": "short English topic",
  "why": "the 3 candidates and why the pick will spread",
  "voice": "Konoha",
  "yomi": {"GPT": "ジーピーティー"},
  "instruction": "the editor's instruction, in Japanese",
  "lines": ["…", "…"],
  "sources": [{"title": "…", "url": "…"}]
}
```

- `voice`: Konoha (explainer, default), Harune (narrator), Satomi (calm), Asahi (natural, male), Otani (storyteller,
  male, documentary).
- `yomi`: how the voice must say a written word it would misread (Latin names, numbers read a special way). Hacozy is
  always read ハコジー already; add others only when needed. Captions keep the written word.
- `instruction`: what Rakuda's editor should make of it, the way a creator types it: 「タイトルは「<title>」。テンポよく
  (tight)。ステップ見出しの画面は入れない。」 then the hook: the key idea already happening on screen from the first frame,
  moving, on the words spoken then, recognisable at once (never a logo, an empty diagram or a page of text). Then one
  visual per beat that shows the mechanism (illustrative examples labelled イメージ図), real-looking, not a kids'
  diagram. Text, captions and visuals centred on the frame (x=540). The top label is the title. The ending carries
  straight on from the story (no ad card); the Hacozy icon material appears only on 「続きはHacozyで。」.

## 5. Write `REEL_DIR/caption.txt`

The Instagram caption in Japanese: line 1 the hook as a question or surprise; 2-3 short lines on what the video
shows; then 「続きはHacozyのコース「<course_title>」で。プロフィールのリンクからインストールできます。」; then 5-8
hashtags (#Hacozy #学び直し #仕組み plus topic tags). No em dashes.

Do not run the engine, commit or post: the workflow does that after you.
