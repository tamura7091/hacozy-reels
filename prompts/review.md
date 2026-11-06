# Review today's Hacozy reel before it is posted

The reel in `REEL_DIR` was just made by the Rakuda engine: `REEL_DIR/reel.mp4` (the export), `reel.json` and
`caption.txt` (the script and caption), and the engine's project in `PROJECT_DIR` (`structure.json`: the sections and
their visuals; `chunks.json`: when each line is said). **Only super high quality reels are posted to
@hacozy_official.** You are the last check, as a demanding creative director. Nobody else looks before it goes public.
Be efficient: one careful look, about 10 minutes.

1. Look at it: extract frames with ffmpeg at 0.5, 1.5 and 2.5 s, then one every 3 s to the end, plus any moment that
   looks off; tile them into one or two contact sheets (ffmpeg `tile`) and Read those, then zoom on the hook and the
   ending. Compare the line times in `chunks.json` with what each frame shows.
2. Judge it by Rakuda's own bars: the `QUALITY` text in `rakuda/engine/pipeline.py` and the pre-post review in
   `rakuda/web/lib/viral.ts` `review` (the first 3 seconds decide whether viewers stay). Fail anything broken: text cut
   off or overlapping, an empty or frozen stage, a visual that shows something other than its line, captions out of
   sync, a wrong fact, ugly composition, text or visuals off centre (they belong on x=540) or under the platform UI
   (keep inside top 220, bottom 420, left 60, right 150 px), green used as an accent (Hacozy is blue), the top label not
   the reel's topic, or the ending missing (the last lines and the caption must name the course and say to install
   Hacozy from the profile link).
3. Write `REEL_DIR/review.json`:

```json
{
  "pass": false,
  "summary": "one or two sentences: the verdict and the one thing that matters most",
  "revise": [{"section": 3, "request": "concrete change, in Japanese, the way a creator asks Rakuda's chat", "quick": true}]
}
```

- `pass: true` only if you would proudly put it on the brand's account today. Small flaws a viewer would not notice
  do not fail a reel; anything a viewer would notice does.
- `revise`: at most 2 sections (indexes in `structure.json` `sections`), each with one concrete request. Leave it
  empty when no visual redo can fix the problem (then nothing is posted today).
- `quick: true` when the visual is right and only needs a tweak (a label, a stray mark, position, size, crop, colour,
  timing): Rakuda edits it in place in minutes. `quick: false` only when the visual itself is wrong or broken (wrong
  thing, empty or grey stage, a placeholder): it is rebuilt from scratch, which is slow. Prefer quick.
- This is round ROUND_N of 2. In round 2 there is no further fix: pass or fail it as it is, and check first that every
  round-1 request (`review-1.json`) was actually fixed.
- You may also improve `caption.txt`.

Do not run the engine, commit or post.
