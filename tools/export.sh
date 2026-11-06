#!/bin/bash
# Renders the Rakuda project to an mp4 and copies it to REEL_DIR/reel.mp4. The engine's export records a failure in
# error.log / render.log and still exits 0, so this checks for the mp4 itself, shows why it is missing, and tries once
# more (a frame render can fail on a fluke), then fails.
#
#   tools/export.sh <reel dir> <project dir>
dir="$1"; proj="$2"
for try in 1 2; do
  rm -f "$proj/error.log"
  python3 rakuda/engine/pipeline.py export "$proj"
  f=$(ls -t "$proj"/exports/*.mp4 2>/dev/null | head -n 1)
  if [ -n "$f" ]; then cp "$f" "$dir/reel.mp4"; exit 0; fi
  echo "::warning::export try $try made no mp4"
  [ -f "$proj/render.log" ] && tail -40 "$proj/render.log"
  [ -f "$proj/error.log" ] && tail -8 "$proj/error.log"
done
echo "::error::the export made no mp4"
exit 1
