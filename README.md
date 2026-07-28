# Brewci

Scroll-driven single-page site for Brewci, a coffee shop in Lahore. No build
step — plain HTML/CSS/JS with GSAP 3 + ScrollTrigger and Lenis via CDN.

## Running it

The site uses relative paths only (no `fetch`/modules), so opening
`index.html` directly works. A local server is still recommended so your
browser doesn't aggressively cache assets while you edit:

```bash
python3 -m http.server 8000
# or, to also disable browser caching while developing:
python3 _nocache_server.py   # serves on :8123
```

## Page structure

| Scene | Section id | Pinned | Init function |
|---|---|---|---|
| S1 The Blast | `#scene-blast` | yes | `initSceneBlast` |
| S2 The Pour | `#scene-pour` | yes | `initScenePour` |
| S3 The Menu Show | `#scene-table` | yes | `initSceneTable` |
| S4 The Coffee | `#scene-coffee` | no | `initSceneCoffee` |
| S5 Hours & Place | `#scene-hours` | no | `initSceneHours` |
| S6 Host With Us | `#scene-host` | no | `initSceneHost` |

All scroll-distance/scrub values live in `js/config.js` — nothing else
should hardcode a `vh`, `scrub`, or `duration`. Note the pin-duration
formula in each scene's `ScrollTrigger.create` is `end: '+=' + (cfg.vh -
100) + '%'`: GSAP's pin-spacer for a self-pinned element reserves the
element's own natural height *plus* the configured pin duration, so
subtracting 100 keeps the total on-screen scroll distance equal to `cfg.vh`.

The pinned/scrub scenes (S1–S3) run identically on every device and screen
size — there's no separate stripped-down mobile fallback. Layout adapts via
plain responsive CSS (`clamp()` font sizes, `vw`-relative sizing, a couple of
cosmetic breakpoints for portal padding), while the animation logic itself
is device-agnostic. This only works because the media assets are small
(~400KB–1MB each, see "Where to swap each asset" below) — the original
Higgsfield exports were 6-8MB each and would make this approach painful on
mobile connections. `prefers-reduced-motion: reduce` skips all scroll-driven
animation regardless of device; every scene renders its end state
immediately.

### S1 — The Blast
Full-color looping video (`assets/a1-hero-color.mp4`) behind the small logo
mark, which scales out as the "BREWCI" wordmark wipes in. No other copy.

### S2 — The Pour
Full-color looping video (`assets/a2-pour-color.mp4`), no text — pinned for
the cinematic beat only.

### S3 — The Menu Show
White background with a colorful confetti burst (`.confetti__piece`,
positioned at the left/right edges) pulsing whenever an item is centered.
Eight real menu items (`.showcase__item`, each on a plate) cycle through in
sequence as you scroll; each has its own entrance direction set via
`data-variant` (`from-left`, `from-right`, `from-top`, `from-bottom`,
`from-top-left`, `from-bottom-right`, `zoom`, `spin` — mapped to travel
vectors in `initSceneTable`'s `VARIANTS` object). Everything is 2D
(translate/scale/rotate, no 3D/perspective) by design — it's both cheaper to
render and was the fix for intermittent renderer stalls during development.

### S4 — The Coffee
Real menu highlights (Espresso/Filter/Milk Drinks) in a sticky card stack,
with the bean-texture background drifting on scroll.

### S5 — Hours & Place
Background inverts black → white as you scroll through. The open/closed
indicator (`updateOpenStatus` in `js/main.js`) computes live against
Pakistan Standard Time (UTC+5, no DST), 8:00 AM–2:00 AM (window crosses
midnight).

### S6 — Host With Us
Validated event-inquiry form; see "Wiring the form" below.

## Menu / Rules portals

Two fixed buttons (top-right, `.portal-nav`) open full-screen overlays
(`js/portals.js`) with a circular "iris" wipe from the button's position
(driven by animating a `clip-path: circle()` radius, not a CSS transition,
for easing control). The Menu portal lists the full real menu (11
categories); the Rules portal shows the café conduct announcement.

The overlay panels have `data-lenis-prevent` and the portal open/close
handlers call `window.__brewciLenis.stop()/.start()` — without both, Lenis
intercepts wheel/touch input meant for the panel's native scroll.

## Where to swap each asset

| Asset | File | Used in |
|---|---|---|
| Logo | `assets/logo.svg` | S1 intro, S6 header — placeholder wordmark, marked `<!-- TODO: replace with real logo -->` in `index.html` |
| Hero video | `assets/a1-hero-color.mp4` | S1 |
| Pour video | `assets/a2-pour-color.mp4` | S2 |
| Showcase items | `assets/{pizza,sandwich,cup,french-toast,pancakes,caesar-salad,cheesecake,iced-latte}-color.png` | S3 |
| Bean texture | `assets/beans-texture.png` | S4 background |

Full generation prompts and Higgsfield job IDs for the original Phase-0
asset set are in `assets/MANIFEST.md` (some of those files were since
replaced by colored/background-removed versions — the manifest documents
the generation history, not necessarily what's currently wired in).

Images are pre-compressed (resized via macOS `sips`, since no image
optimizer was available) — keep new assets under ~1MB each; the originals
from Higgsfield come back at 6-8MB and will noticeably slow the page (this
was also the root cause of some renderer stalls during development).

## Wiring the form (S6)

The submit handler in `js/main.js` (`initSceneHost`) checks
`window.BREWCI_FORM_ENDPOINT`. If it's unset, submissions are only logged to
the console (a stub) so the UI is fully demoable without a backend.

To connect a real service, set `window.BREWCI_FORM_ENDPOINT` to your form
service's URL (e.g. in a small script tag before `js/main.js`, or inject it
however your hosting setup prefers — don't commit real endpoint URLs/keys
directly into `index.html` if they're sensitive).

The handler POSTs the form as JSON. If the request fails (or no endpoint is
configured), a banner points people to the `mailto:` fallback that's always
visible under the form regardless.

## Content still needed

See `CONTENT-TODO.md` for placeholders that need a real answer before launch
(extraction stats in S2 are marked `[TO CONFIRM]` in the UI itself).
