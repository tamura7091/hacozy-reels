<!-- Copy of .agents/skills/hacozy-short-script/SKILL.md in the os repo (Naoki's rules for Hacozy short scripts). Refresh: cp ~/os/.agents/skills/hacozy-short-script/SKILL.md rules/hacozy-short-script.md (then re-add this line). -->
---
name: hacozy-short-script
description: Write the Japanese voiceover script for a Hacozy short that Naoki records and edits in Rakuda — built on a real Hacozy course, the title or striking result then straight into the explanation in one flow (no ステップ headings), the mechanism in precise plain words (no spec numbers or formulas), one familiar Japanese example per beat with its reason, calm です／ます narration, and a CTA selling a published course that covers the topic. Produces script.txt (Rakuda ステップ1) and rakuda-instruction.txt (ステップ2); with an AI voice, also the ElevenLabs narration and a local Rakuda project (see AI-voice reels in local Rakuda). Use whenever Naoki asks for a short / 台本 / スクリプト for Rakuda or about a Hacozy course topic.
---

# Hacozy short script for Rakuda

The script is what Naoki reads aloud; Rakuda does the cutting, captions and visuals
from it. So the script and its Rakuda instruction are the whole deliverable — no
widgets, no editor, no `script.json` (that is the older
[video-editor](../video-editor/SKILL.md) pipeline).

Reference: [hacozy/shorts/projects/how-chatgpt-is-made/](../../../hacozy/shorts/projects/how-chatgpt-is-made/)
(「ChatGPTの作り方」, Stanford CME295) — `script.txt` is Naoki's final wording, the bar for tone:
plain explanatory sentences, one worked example per beat. For structure, follow
[double-slit/](../../../hacozy/shorts/projects/double-slit/): one flow, no ステップ headings.

## Naoki's rules

These come from how Naoki rewrote the first drafts of 「ChatGPTの作り方」 into his final.

1. **Start on the topic.** The first line is the title or the result stated as one
   striking sentence (「電子を1個ずつ撃つと、ありえない模様が現れます。」), then straight
   into the explanation. No 「今日は〜」, no source intro, no goal-setting, and no
   trivia hook either (a draft opened on token ids 「7297、6676、16211」; he cut it).
   The topic itself is the hook; the striking first frame is Rakuda's job
   (`rakuda-instruction.txt`).
   **The first line is the most important line: it must build curiosity, never
   answer it.** Viewers stay for the result promised in the first 3 seconds, so the
   opening makes a promise and holds the answer back. A first line that states the
   mechanism (「画像生成AIは、砂嵐のようなノイズから絵を作っています。」) spends the
   payoff up front; Naoki replaced it with the bare title 「画像生成AIの仕組み」
   (2026-10-15). The second line then asks the question the video will answer.
   The bar is 1M views: if you would not bet the opening gets there, rewrite it
   before handing over. The strongest form is a true paradox the video resolves
   (「画像生成AIは、絵の描き方を一度も教わっていません。教わったのは、汚れた写真を
   きれいに戻す方法だけです。それなのに、なぜ〜」): an anomaly, a promise, the answer
   withheld. Check it is literally true; the hook must not overclaim.
   Hook the mystery most viewers already feel, not the engineer's clever trick.
   For image generation that is 「言葉を理解して絵にできるのはなぜか」, not the
   denoising trick, so the story starts from 絵も言葉もただの数字 (AI101 v3
   lesson 0) and diffusion is one late beat (Naoki, 2026-10-15).
2. **Explain the mechanism, not the statistics.** Each step says what is done and
   why it is needed, in precise words (トークン, ベクトル, 多次元空間, アテンション,
   事前学習), each named in 「」 and explained in the same sentence. Drop model
   specs, formulas and benchmark numbers that don't change the viewer's
   understanding (12,288 dimensions, −log p, Q/K/V, 1750億, 3000億, 13億 vs GPT-3);
   a rough range carries the idea (「数百〜数千個の数値」). Adult, not childish —
   and not a paper either.
3. **One familiar example per beat, and the reason.** Examples are everyday
   Japanese (「お世話になって」→「おります」, 「ケーキを冷蔵庫に入れて、夜にそれを
   食べた」, 「お水をください」), never translated English. Each example must show
   the step's actual point — the attention example has a 「それ」 with two candidates
   and a clue far away, not a word disambiguated by its neighbour. A failure case
   says why it happens (事前学習だけのAIは文章の続きを自動補完するだけだから).
   A clear illustrative example beats a real but foreign one, as long as the
   mechanism it shows is right; search how the concept is usually explained when
   unsure.
4. **One flow, no ステップ headings by default: problem → what we do → example,**
   each beat linked by そこで／次に／では／すると. The two most-viewed reels (Googleマップ
   151K, 二重スリット 137K) have no headings; the stepped ChatGPTの作り方 got 6K, and
   Naoki dropped 「ステップN」 from 王−男＋女 (2026-10-06). Use 「ステップN：〜する」
   headings only when he asks for them.
   Nothing outside the steps' question — no caveat coda, no side facts (the
   「正しいとは限りません」 limitation, RLHF's name, the InstructGPT result were cut).
   End on the result: 「以上のプロセスを経て〜は完成します。」
5. **Tell a story, not a list of facts.** Right after the title, ask the viewer's
   question (「スマホは、自分がどこにいるのかを、どうやって知っているのでしょうか。」).
   After that, every line answers the gap the previous line left open or opens the
   next one: a clue → what it lets us do → why that is not enough yet → the fix →
   the new problem the fix runs into. A fact gets into the script only as the
   answer to a question already in the viewer's head. Two facts stacked side by
   side are a list and need a bridge between them. Naoki rejected
   「青い点は宇宙から届く時刻をもとに計算されています。／上空およそ2万キロでは、30機ほどの
   GPS衛星が…」 as 「一行ずつファクトを並べてて繋がりが感じられない」
   (2026-10-12). Test: if two lines could swap places without breaking anything,
   the link between them is missing. Twists are announced as a turn
   (「これで〜はずでした。ところが〜」), not tacked on as one more fact.
   Teach the plain mechanism first, in literal terms, and save the twist for
   later. Nothing before the twist should hint at it. 「時刻は、ほんの少しだけ過去の
   ものになっています」 sounded like relativity before relativity came up. Naoki
   (2026-10-12): 「相対性理論は後に出せばいいからまずは仕組みを教えないと」. Say what
   is actually done: 送信時刻と受け取った時刻を比べる → その差が飛んできた時間.
6. **Written narration register.** です／ます, explanatory and calm (〜のため、〜します);
   no chatty 「なんです」「なんと」「〜わけです」.
7. **The CTA sells a published Hacozy course that covers the video's content** —
   not necessarily the course the script was built from. Check `is_published` in
   Supabase (`courses`, key `SUPABASE_SECRET_KEY` in `hacozy/web/.env`) and that
   its lessons cover the topic.
   **The CTA must not sound like an ad: viewers drop at an obvious one** (Naoki,
   2026-10-15). The old fixed form 「大人の学び直しアプリHacozyで公開中の〜では、こうした
   〜をさらに詳しく解説しています。興味のある方はプロフィールのリンクからどうぞ。」 is
   retired. Instead, the story's last beat opens the next question the video
   naturally raises, and the course is where that question is answered, in two
   short lines with no 「大人の学び直しアプリ」, 「興味のある方は」 or link sentence (the
   link goes on screen):
   「では、AIはそもそも、写真からどうやって「猫らしさ」を覚えるのでしょうか。／
   その仕組みは、Hacozyのコース「AI基礎」で、ハーバード大学の講義CS50をもとに解説しています。」
   The question must be a real follow-on to the video's content and one the
   course's lessons answer.
   **Update (Naoki, 2026-10-19): the CTA may be fuller and sell Hacozy.** After the
   question and the course line, add one or two lines on what the course actually
   covers (its real lessons and how they teach: 本物のコード、触って動かせる図) and
   one line on Hacozy itself, ending on 「スマホで数分ずつ、本物の資料から学べる。それが
   Hacozyです。」. Still no 「興味のある方は」 or link sentence. In `rakuda-instruction.txt` the visual carries
   straight on from the story; no switch to an ad card.
8. **Theme the video on what makes the course itself unique, then fan facts.**
   For 「アポロ11号のコードを読む」 Naoki's steer (2026-10-19) was: the real code is public
   and tiny, and somehow they programmed it → small fan facts and details → the
   drama (1202) last. Don't build the whole video on the most dramatic event.
   Fan facts are quoted verbatim from the source (grep the real files: the
   `PINBALL_GAME_BUTTONS_AND_LIGHTS` Shakespeare quote, `# TEMPORARY, I HOPE HOPE HOPE`,
   `BURN, BABY, BURN`); in AGC code only `#` comments are 1969, `##` are modern notes.
9. **Natural Japanese goes through Gemini, then a fact diff.** Run the draft through
   Gemini ([[gemini-for-natural-japanese]]; `gemini-3.8-flash` — `gemini-pro-latest`
   hung for 5+ min) with "don't change facts, numbers, names or line order". Then
   diff every line: it drifted 降ろした→送り届けた, おぞましい→不吉な, and 「全部捨てて」→
   「低い優先度の処理を捨て」. Translated quotes need both natural and faithful:
   「一時的な処置。そうであってほしい、ほしい、ほしい」 (unnatural) and 「頼む、頼む、頼む」
   (wrong meaning) lost to 「とりあえずの処置……だといいな、本当に」.
10. **His wording wins.** Title, format and phrasing are his;
   when he pastes a final, save it as is (one phrase per line) and only flag facts.

## Steps

1. **Find the course.** `hacozy/Hacozy Team/Course Building/courses/*/course.json`
   titles; read the matching lessons' `slides_v2.json` for scope and order. Note
   `is_published` — if the CTA's course is not published, tell Naoki before he records.
2. **Verify every name, date and number** against English primary sources (papers
   on arXiv, the company's own post; archived copy when the site blocks fetches).
   Same source rules as the video-editor skill's research step.
3. **Write** `hacozy/shorts/projects/<slug>/script.txt`: plain lines, one spoken
   phrase each, pasted as-is into Rakuda ステップ1. Aim for about 1,000–1,100 characters
   when Naoki records (≈6.5 chars/s; Rakuda's pause cuts take off roughly 20–30 %), but
   **850–900 for an AI voice**: nothing is cut, and 1,143 characters read at 3:22,
   ~900 at 2:20 even after tightening pauses.
4. **Write** `rakuda-instruction.txt` next to it for ステップ2: the title, `tight`
   pace, no STEP heading screens (the visuals run straight into the next beat), **the hook** — the key idea already happening on screen from the first frame, moving, on the words spoken
   then: the real map with the route drawing itself, electrons landing until the pattern appears. Never a logo held
   alone, an empty diagram or a page of text to read (on the posted reels, 2026-10-02: logo-only ChatGPTの作り方 4.9K,
   a blog-page opening 962, against 138K and 111K for the two that opened on the phenomenon; the channel's
   current learnings are in Rakuda's バズ tab, and Rakuda's AI editor reads them) — and one visual per beat that shows the
   mechanism the script explains (illustrative examples labelled イメージ図) — a
   real-looking mechanism, not a kids' diagram.
   **Real footage beats a re-creation for the hook, and the subject must be
   recognisable in frame 1.** A low-res 3D Moon and a close-up of launch flames
   ("just fire, can't see the rocket") both failed (2026-10-19); the white Saturn V
   rising past the tower worked. Check frame 0 and 0.5 s on a contact sheet, and
   avoid stretches that blow out to white under the captions.
   **The title names the subject plainly** (「アポロ11号のプログラムは誰でも読める」, not
   「月面着陸のコードは、誰でも読める」, which read as unclear).
5. **Hand over**: both texts in chat plus SendUserFile; list the sources and any
   overclaims or unpublished-course flags. Stop — Naoki edits the wording and
   records; his rewrite becomes the script.

## AI-voice reels in local Rakuda

When Naoki asks for the finished video (not just the script) with an AI voice:

1. **Voice (ElevenLabs).** Key `ELEVENLABS_API_KEY` in `vault/rakuda-elevenlabs.env`;
   `eleven_v4`, `language_code: ja`, `output_format: mp3_44100_128` (192 needs the
   Creator tier), `voice_settings.speed: 1.1`. Voices are Rakuda's `web/lib/voices.ts`
   (Otani 低め・語り for documentary, Konoha 解説向き for explainers). Read a
   `script-yomi.txt`, keep `script.txt` for captions: Hacozy→ハコジー,
   GitHub→ギットハブ, 「1202」→いち、にー、ぜろ、にー, short numbers spelled in kana.
   Then cap pauses at ~0.45 s after a sentence and ~0.26 s inside one, save as
   `recording.m4a`, and transcribe it (gpt-4o-transcribe) to check every reading.
2. **Project.** `rakuda/data/projects/<id>/`: `recording.m4a`; `project.json` with
   `lang: ja`, `polished: true`, `asis: true`, `script`, `instruction`, `channel`
   (Hacozy `6c5e10a070d9`), a `theme` id and your own `look` (Hacozy dark: ground
   #131f2b, ink #f1f7fb, accent #2e90d9, gold only for alarms; light: #f6f8fb,
   #1a2333, #0e6fbf; never green), `plugins: {"bgm": false}` (no BGM — Naoki,
   2026-10-19; Rakuda's own pick is CC BY and owes a credit); `materials.json` items
   with a note each saying what it is and where it goes. Then
   `python3 engine/pipeline.py edit <dir>`.
3. **Real material.** Public-domain footage and photos from Wikimedia Commons (NASA:
   the 1080p film "The Eagle Has Landed, The Flight of Apollo 11" has the tower-camera
   liftoff at ~4:37–5:19; camera E-8 is too close — all fire). Hacozy Space
   (`personal/projects/space-explorer`, `?debug` exposes `window.__se` with
   `startTour`/`tourStep`/`step`) renders 3D shots frame by frame in headless Chrome.
   GitHub pages via `engine/capture.mjs`. **Encode every clip all-intra (`-g 1`)**:
   components seek the video per frame, and with sparse keyframes the preview sits on
   a still for a second.
4. **One edit run at a time.** Two `pipeline.py` processes race on `data/spend.json`
   and one crashes; run them in turn or from an engine copy with its own `data/`.
5. **Review the export like a viewer, then fix by section.** Contact sheet every 4 s,
   then zoom on the hook and the CTA. Found this time: 7 seats drawn for 8 core sets,
   a raw-transcript caption (「こんぴゅた」, fixed in `chunks.json`), a cluttered CTA, a
   panel over a clip, NOW vs 今. Fix with `revise` (`revise.json`
   `{section, request, quick}`, one at a time); a label in a spec is faster to set in
   `structure.json` directly (a `quick` revise left it). A seek threshold over 1/30 s
   (`> .04`) in a component skips every other frame — tighten it.
   Rakuda caches frames by file name: a replaced clip needs a new file name.
6. **Hand over the project, don't export.** Naoki exports himself; open
   http://localhost:4800 and name the project ids. Copy to ~/Downloads only when asked.

