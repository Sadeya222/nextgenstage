# src/assets/real/

Real product photography and video thumbnails sourced from
**https://www.portablestage.co.uk/** — used by `src/data/content.ts`.

**These files must be committed to git.** They are not generated.

If they are missing, `npm run build` fails with:

```
[vite:asset] Could not load .../src/assets/real/module-1x1.jpg (ENOENT)
```

## Self-healing

`scripts/fetch-images.mjs` runs automatically as a `prebuild` step:

1. Keeps any file already on disk (> 2 KB) → rebuilds work offline.
2. Downloads missing files from portablestage.co.uk.
3. Writes a valid 1×1 placeholder if the network fails → the build still
   succeeds (never blocks a deploy).

Run it manually any time:

```bash
npm run assets      # or: node scripts/fetch-images.mjs
```

## Manifest

| File | Source |
| --- | --- |
| `module-1x1.jpg` | SteelCity Staging Module 1×1m (deck & riser) |
| `module-1x520.jpg` | SteelCity Staging Module 1×520mm |
| `platinum-deck.png` | NexGen Platinum ECO deck platform |
| `pkg-3x2.jpg` / `pkg-4x3.jpg` / `pkg-6x3.jpg` | Stage packages 3×2m, 4×3m, 6×3m |
| `staging-london.jpg` | NexGen staging installed in London |
| `choir-tiers.jpg` | 3 Tier Choir Portable Staging Package |
| `podium-conductor.jpg` | Speaker / Camera / Conductors Mobile Podium |
| `podium-winners.png` | Winners Podium – Medal Awards Ceremony |
| `fascia-hard.jpg` | NexGen Hard Fascia Valance 1000mm |
| `valance-cloth.jpg` | NexGen Platinum Cloth Valance 1000mm |
| `valance-clips.jpeg` | NexGen Valance Clips (pack of 25) |
| `handrail.png` | NexGen Portable Staging Handrail |
| `trolley-panel.png` | NexGen Panel Trolley |
| `trolley-case.jpeg` | NexGen Panel Case Trolley |
| `backdrop-kit.jpg` | NexGen Stage Backdrop Kit |
| `dance-kit.jpg` | NexGen Dance Floor Adaptation Kit |
| `floor-pads.png` | Staging Floor Pads – Adhesive Rubber |
| `floor-wedges.png` | Uneven Floor Staging Wedges |
| `ramp-access.png` | Folding Disabled Access Ramp 5ft |
| `yt-magnetic.jpg` | YouTube thumb – `o94G3BRJB4Q` (Magnetic staging) |
| `yt-platinum.jpg` | YouTube thumb – `13Scgq9p2kA` (Platinum & Backdrop) |
| `yt-events.jpg` | YouTube thumb – `QtWte86aOso` (Events) |

To change an image, edit the URL in `scripts/fetch-images.mjs`, delete the local
file, and re-run `npm run assets`.
