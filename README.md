# hacozy-reels

A daily Japanese explainer reel for the **@hacozy_official** Instagram, built from a real Hacozy lesson, made by the
real Rakuda engine and posted with nobody's computer on. Sister of
[tamura7091/rakuda-reels](https://github.com/tamura7091/rakuda-reels) (same engine, different account, topics and ending).

Every day at 10:00 JST a GitHub Action ([.github/workflows/reel.yml](.github/workflows/reel.yml)) runs on Naoki's
Claude plan (Claude Code, `CLAUDE_CODE_OAUTH_TOKEN`); no Rakuda credits and no Claude API keys. A run takes about
1.5 hours and posts at once when the reel passes.

0. **Shortlist** ([tools/pick.mjs](tools/pick.mjs)): the live Hacozy catalog (Supabase `courses` / `lessons`, the web
   app's public key) → published courses that went longest without a reel, each with its lessons that never had one
   ([history.json](history.json) records `course_id` / `lesson_id` of every post). Courses rotate; lessons never repeat.
1. **Lesson and script** ([prompts/script.md](prompts/script.md)): Claude Code picks the lesson that makes the best
   reel, checks every fact on English primary sources and writes the script by Naoki's Hacozy short rules
   ([rules/hacozy-short-script.md](rules/hacozy-short-script.md), a copy of the os repo skill): the first line builds
   curiosity and never answers it; one flow; the ending asks the next question the course answers, names the course,
   then 「続きはHacozyで。」「プロフィールのリンクからインストールしてね。」 (the caption says the same).
2. **Natural Japanese**: Gemini rewrites the lines as a native narrator ([tools/polish.mjs](tools/polish.mjs),
   `gemini-pro-latest`, falls back to flash), and Claude keeps each rewrite only when no fact moved
   ([prompts/finalize.md](prompts/finalize.md)).
3. **Edit** ([tools/project.mjs](tools/project.mjs)): ElevenLabs reads it (Hacozy is said ハコジー, the captions keep
   "Hacozy"); the project gets the Hacozy dark look (navy, blue accent, never green), no BGM and the app icon for the
   ending; then `pipeline.py hear` and `export`.
4. **Review** ([prompts/review.md](prompts/review.md)): one look as creative director against Rakuda's `QUALITY` bar and
   the Hacozy layout rules (centred on x=540, inside the safe zone, top label = the topic). If it fails, at most two
   sections are fixed (`revise`, quick tweaks preferred) and a second, final review decides.
5. **Post** ([tools/post.mjs](tools/post.mjs)): the mp4 is uploaded to Instagram (resumable upload) as soon as it
   passes. It checks the token posts as @hacozy_official before any work starts, and counts a post only when
   Instagram returns its permalink.

**When nothing is posted, an issue says so.** Any scheduled (or "publish") run that ends without a reel on Instagram,
for whatever reason, fails and opens a GitHub issue with the run link and what to do.

The repo is public so Actions minutes are free; nothing private is in it, and each secret is given only to the step
that needs it (Claude never sees the Instagram, Gemini, ElevenLabs or Supabase keys).

## Secrets (Settings → Secrets and variables → Actions)

| Secret | What | Where it came from |
|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code on Naoki's Claude plan (1 year) | `claude setup-token`; Kaminari `HACOZY_REELS_CLAUDE_TOKEN` |
| `IG_TOKEN` | posts to @hacozy_official: the system user "Rakuda Reels Publisher" token (Rakuda business 2556162848129136, app "Rakuda Reels"), which reaches the account because the Hacozy portfolio (901982835632847) shares its Page "Hacozy" 924885604045537, linked to @hacozy_official, with Rakuda as partner. The same token posts @rakuda.studio, so regenerate it for both (60-day token made 2026-11-07; next time pick 有効期限 なし) | Kaminari `RAKUDA_IG_TOKEN` ([tools/connect.sh](tools/connect.sh)) |
| `IG_USER_ID` | @hacozy_official's Instagram user id, 17841480209110384 | not a secret |
| `ELEVENLABS_API_KEY` | the voice | Rakuda's ElevenLabs key (os `vault/rakuda-elevenlabs.env`) |
| `GEMINI_API_KEY` | the Japanese polish | Kaminari `PERSONAL_GEMINI_API_KEY` (personal, never Speak's) |
| `HACOZY_SUPABASE_URL`, `HACOZY_SUPABASE_KEY` | read the catalog | the Hacozy web app's public (anon) key, `hacozy/web/.env` |
| `RAKUDA_DEPLOY_KEY` | read-only deploy key of tamura7091/rakuda ("hacozy-reels Actions (read-only)") | generated for this repo |
| `CHANNEL_JSON` | the Hacozy channel's learnings, for the engine | rakuda/data/channels/6c5e10a070d9/channel.json |

[tools/connect.sh](tools/connect.sh) copies the Kaminari items into these secrets without showing them.

## Run by hand

Actions → **Daily reel** → Run workflow. Leave "publish" off to make and review a reel without posting (the mp4 is in
the run's artifacts); tick it to post.
