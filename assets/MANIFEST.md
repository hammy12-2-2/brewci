# Brewci — Asset Manifest (Phase 0)

Generated via the Higgsfield MCP. All core brand assets (A1–A6) are black & white per spec.

## Core brand assets

| Asset | File | Model | Job ID | Prompt |
|---|---|---|---|---|
| A1 — Hero video | `a1-hero.mp4` | cinematic_studio_video_v2 (16:9, 5s, slowmo, sound off) | `e2957ce5-7359-4ec8-b655-98a4e62be9b9` | Extreme slow motion. A dense cloud of dark roasted coffee beans bursts outward toward the camera against a pure black void, beans tumbling and spinning with hard specular highlights and motion blur. The swarm decelerates, reverses, and the beans converge and compact into the solid silhouette of a professional espresso machine — group head, portafilter, body. High contrast black and white, no colour, studio rim lighting, shallow depth of field, macro, 35mm, cinematic. |
| A2 — Pour video | `a2-pour.mp4` | cinematic_studio_video_v2 (16:9, 4s, slowmo, sound off) | `4a362484-f3e4-4843-807b-f63239d0c29b` | Low three-quarter angle macro shot of a chrome espresso machine group head with a portafilter locked in place. Two ribbons of espresso fall into a white ceramic cup, crema forming and swirling on the surface, steam curling upward through a hard side light. High contrast black and white, deep black background, shallow depth of field, slow motion. |
| A3 — Table still | `table.png` | cinematic_studio_2_5 (16:9, 2k) | `b100721f-e2af-4266-bca3-40a81faa6076` | Overhead 45-degree view of a single white ceramic cup of espresso with crema on a dark matte table. Generous empty negative space to the left and right of the cup. Black and white, high contrast, single hard overhead light, deep directional shadow. |
| A4 — Pizza (cutout) | `pizza.png` | cinematic_studio_2_5 (1:1, 2k) → image_background_remover | image: `5530d45f-a51b-4cdc-8fef-fa0f84442741`, bg-remove: `e7284aaa-7501-449c-90b2-aca0078c8b75` | A whole thin-crust pizza on a dark round tray, 45-degree angle, isolated on a plain white background. Black and white photography, high contrast, hard directional light. |
| A5 — Sandwich (cutout) | `sandwich.png` | cinematic_studio_2_5 (1:1, 2k) → image_background_remover | image: `3cfa55c5-a9fc-4dcb-a446-83ac2a12bcc3`, bg-remove: `3847ddd4-731a-4ca0-b7d5-457e0b5daac2` | A cut sandwich on a dark slate board, 45-degree angle, isolated on a plain white background. Black and white photography, high contrast, hard directional light. |
| A6 — Bean texture | `beans-texture.png` | cinematic_studio_2_5 (16:9, 2k) | `87e6a067-b277-491a-9b29-9f9533398650` | Macro texture of scattered dark roasted coffee beans filling the entire frame, black and white, high contrast, hard raking light, deep shadows between the beans. |

## Frame sequences

Not yet extracted — `ffmpeg` is not installed on this machine. See README for the extraction commands to run once available. `a1-hero.mp4` and `a2-pour.mp4` above are the source clips.

## Extras (not part of the monochrome brand system)

Generated on request, out of scope for the site build — kept for reference only, do not wire into Phase 1 without confirming with the client since they break the "no colour anywhere" brand rule.

| File | Model | Job ID | Note |
|---|---|---|---|
| `extras/pizza-colorized.mp4` | kling3_0_turbo (start-frame animation, 5s) | `a7758fa7-3bc9-46f8-9c0a-15c524dba789` | Colorized/animated version of A4, requested ad hoc. |
| `extras/sandwich-colorized.mp4` | kling3_0_turbo (start-frame animation, 5s) | `b9a396f6-87d2-442b-a9c8-934819564a69` | Colorized/animated version of A5, requested ad hoc. |
| `extras/table-colorized.mp4` | kling3_0_turbo (start-frame animation, 5s) | `6d9eaebd-1194-4e5a-b4cd-7f540550d8da` | Colorized/animated version of A3, requested ad hoc. |
