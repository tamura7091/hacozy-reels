#!/bin/sh
# Copies credentials into this repo's Actions secrets without showing them. Run from the repo root on Naoki's Mac.
#   tools/connect.sh            everything below
#   tools/connect.sh ig         only the Instagram token and user id
# Kaminari items (collect a new one with ~/os/tools/set-credential.sh NAME "Title" in a terminal tab):
#   HACOZY_REELS_CLAUDE_TOKEN   `claude setup-token` (Claude plan sign-in, sk-ant-oat…)
#   HACOZY_IG_TOKEN             the token that posts to @hacozy_official
#   HACOZY_IG_USER_ID           @hacozy_official's Instagram user id
#   PERSONAL_GEMINI_API_KEY     Gemini (personal project, never Speak's key)
set -e
export GH_TOKEN="$(gh auth token --user tamura7091)"
R=tamura7091/hacozy-reels
K="python3 $HOME/os/tools/kaminari.py"
put() { $K exec "V=$2" -- sh -c "printf %s \"\$V\" | tr -d '[:space:]' | gh secret set $1 -R $R"; echo "set $1"; }
put IG_TOKEN HACOZY_IG_TOKEN
put IG_USER_ID HACOZY_IG_USER_ID
[ "$1" = ig ] && exit 0
put CLAUDE_CODE_OAUTH_TOKEN HACOZY_REELS_CLAUDE_TOKEN
put GEMINI_API_KEY PERSONAL_GEMINI_API_KEY
gh secret list -R "$R"
