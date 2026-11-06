# Finalize today's Hacozy reel script after Gemini's pass

`REEL_DIR/reel.json` has your draft `lines`. `REEL_DIR/polish.json` has Gemini's naturalness rewrite of the same
lines (`lines`, same count and order; the last two lines are the fixed ending and never change). Gemini writes more
natural Japanese than Claude, so take its wording by default. But it drifts: it adds facts, softens or changes
meanings, swaps names and numbers, and sometimes gives the hook's answer away.

For every line Gemini changed, compare it with the draft and with the sources in `reel.json`:
- keep Gemini's line when it says the same thing more naturally;
- keep the draft's line (or mix the two) when Gemini changed a fact, number, name, the meaning, added a claim, or made
  line 1 answer its own question;
- keep the course title and the three ending lines exactly as in the draft.

Then read the whole script once more as the viewer and fix only what is still wrong (no em dashes, each line ends in
、 or 。). Write the result back into `REEL_DIR/reel.json` `lines` (keep every other field), and add
`"polish": {"model": "<from polish.json>", "taken": <lines taken from Gemini>, "kept": <changed lines you rejected>}`.
If `caption.txt` reads unnaturally, fix it the same way.

**Length is a hard limit: all lines together must be 520 characters or fewer** (the voice reads about 6 a second,
so 520 is about 85 seconds; longer reels are not made). Count with
`node -e 'console.log(require("./REEL_DIR/reel.json").lines.join("").length)'` after writing. If it is over, cut:
drop the weakest middle beat or merge two lines, never the hook, the question in line 2 or the ending, and count
again until it fits.

Be quick: this is a few minutes' work. Do not run the engine, commit or post.
