#!/usr/bin/env bash
# Capture the README screenshots from the prototype.
#
#   bash tools/make-screenshots.sh
#
# Serves prototype/ locally, drives headless Chrome at phone size, and writes
# PNGs to docs/screenshots/. Re-run whenever the prototype's screens change.

set -euo pipefail

PORT="${PORT:-5199}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/docs/screenshots"

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for candidate in \
    "/c/Program Files/Google/Chrome/Application/chrome.exe" \
    "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
    "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
    "/usr/bin/google-chrome" \
    "/usr/bin/chromium" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if [ -f "$candidate" ]; then CHROME="$candidate"; break; fi
  done
fi
if [ -z "$CHROME" ]; then
  echo "No Chrome or Edge found. Set CHROME=/path/to/browser and re-run." >&2
  exit 1
fi

mkdir -p "$OUT"

python -m http.server "$PORT" --directory "$ROOT/prototype" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT

until curl -sf "http://localhost:$PORT/" >/dev/null; do sleep 0.3; done

shoot() {
  local name="$1" path="$2"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --window-size=520,900 \
    --virtual-time-budget=2500 \
    --screenshot="$(cygpath -w "$OUT/$name.png" 2>/dev/null || echo "$OUT/$name.png")" \
    "http://localhost:$PORT/$path" >/dev/null 2>&1
  echo "  $name.png"
}

echo "Writing to docs/screenshots/"
shoot home '#home'
shoot meal '?seed=meal#photo'
shoot activity '#activity'
shoot history '#history'
shoot stats '#stats'
shoot profile '#profile'
echo "Done."
