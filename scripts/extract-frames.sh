#!/usr/bin/env bash
# Slices assets/a1-hero.mp4 and assets/a2-pour.mp4 into scrubbable WebP frame
# sequences, plus a last-frame still fallback for each. Requires ffmpeg.
#
# After running, update js/config.js:
#   sequences.hero.frameCount -> printed HERO_COUNT
#   sequences.pour.frameCount -> printed POUR_COUNT

set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p assets/seq/hero assets/seq/pour

echo "Extracting hero sequence (assets/a1-hero.mp4)..."
ffmpeg -y -i assets/a1-hero.mp4 -vf "fps=15,scale=1600:-1" -q:v 78 assets/seq/hero/f_%03d.webp

echo "Extracting pour sequence (assets/a2-pour.mp4)..."
ffmpeg -y -i assets/a2-pour.mp4 -vf "fps=15,scale=1600:-1" -q:v 78 assets/seq/pour/f_%03d.webp

echo "Exporting fallback stills (last frame of each clip)..."
ffmpeg -y -sseof -0.1 -i assets/a1-hero.mp4 -update 1 -q:v 3 assets/hero-still.jpg
ffmpeg -y -sseof -0.1 -i assets/a2-pour.mp4 -update 1 -q:v 3 assets/pour-still.jpg

HERO_COUNT=$(ls assets/seq/hero | wc -l | tr -d ' ')
POUR_COUNT=$(ls assets/seq/pour | wc -l | tr -d ' ')
HERO_SIZE=$(du -sh assets/seq/hero | cut -f1)
POUR_SIZE=$(du -sh assets/seq/pour | cut -f1)

echo ""
echo "Hero sequence: $HERO_COUNT frames, $HERO_SIZE total"
echo "Pour sequence: $POUR_COUNT frames, $POUR_SIZE total"
echo ""
echo "Now set in js/config.js:"
echo "  sequences.hero.frameCount = $HERO_COUNT"
echo "  sequences.pour.frameCount = $POUR_COUNT"
