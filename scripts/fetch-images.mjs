#!/usr/bin/env node
/**
 * Downloads the real product images used by src/data/content.ts.
 *
 * Why this exists:
 *   The images live in src/assets/real/ and MUST be committed to git. If they are
 *   missing (fresh clone, partial commit, or a rebuild), Vite fails with:
 *       [vite:asset] Could not load .../src/assets/real/xxx.jpg (ENOENT)
 *
 *   This script runs as a `prebuild` step so `npm run build` is self-healing:
 *     1. If an image already exists and is non-trivial in size -> keep it (offline safe).
 *     2. Otherwise download it from portablestage.co.uk.
 *     3. If the download fails, write a valid tiny image so the build still succeeds.
 *
 * Source of truth for every URL is this file - edit here, not in the components.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "src", "assets", "real");

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WP = "https://www.portablestage.co.uk/wp-content/uploads";
const YT = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const YT_HQ = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** [filename, [candidate urls...]] */
const ASSETS = [
  // ---- Deck platforms & modules (Platinum ECO + SteelCity) ----
  ["module-1x1.jpg", [`${WP}/2025/11/single_1x1m_400high_side.jpg`]],
  ["module-1x520.jpg", [`${WP}/2025/11/single_1x052m_400high_side.jpg`]],
  ["platinum-deck.png", [`${WP}/2023/05/1slide-1.png`]],
  // ---- Stage packages ----
  ["pkg-3x2.jpg", [`${WP}/2025/11/3mx2m_300high200mmstep_side.jpg`]],
  ["pkg-4x3.jpg", [`${WP}/2025/11/4mx3m_400high_side.jpg`]],
  ["pkg-6x3.jpg", [`${WP}/2025/11/6mx3m_400high200mmstep_side.jpg`]],
  ["staging-london.jpg", [`${WP}/2025/12/Staging-in-London-NexGen-Staging.jpg`]],
  // ---- Choir tiers & podiums ----
  ["choir-tiers.jpg", [`${WP}/2023/05/how-to-assemble-staging-tiers-scaled-1.jpg`]],
  ["podium-conductor.jpg", [`${WP}/2023/05/Conductor-Podium-NexGen-Staging.jpg`]],
  ["podium-winners.png", [`${WP}/2023/05/winners-podium-with-fascia.png`]],
  // ---- Accessories: fascia, valance, handrails, trolleys, parts ----
  ["fascia-hard.jpg", [`${WP}/2025/11/single_Fascial_header-e1781633268675.jpg`]],
  ["valance-cloth.jpg", [`${WP}/2023/06/cloth-valance-skirting-nexgen-staging.jpg`]],
  ["valance-clips.jpeg", [`${WP}/2026/02/skirting-clips-nexgen-staging-1-rotated.jpeg`]],
  ["handrail.png", [`${WP}/2023/05/P-11-2.png`]],
  ["trolley-panel.png", [`${WP}/2023/05/Staging-Panel-Truck.png`]],
  ["trolley-case.jpeg", [`${WP}/2025/05/IMG_1243-scaled.jpeg`]],
  ["backdrop-kit.jpg", [`${WP}/2024/05/portable-staging-backdrop-curtain-kit-3m-6m-12m.jpg`]],
  ["dance-kit.jpg", [`${WP}/2025/08/IMG_1997-rotated.jpg`]],
  ["floor-pads.png", [`${WP}/2024/10/nexgen-rubber-staging-floor-pads.png`]],
  ["floor-wedges.png", [`${WP}/2023/05/P-3-1.png`]],
  // ---- Access & safety ----
  ["ramp-access.png", [`${WP}/2023/05/Nexgen-Staging-Ramp-access-fold.png`]],
  // ---- Real YouTube video thumbnails ----
  ["yt-magnetic.jpg", [YT("o94G3BRJB4Q"), YT_HQ("o94G3BRJB4Q")]],
  ["yt-platinum.jpg", [YT("13Scgq9p2kA"), YT_HQ("13Scgq9p2kA")]],
  ["yt-events.jpg", [YT("QtWte86aOso"), YT_HQ("QtWte86aOso")]],
  ["steelcity-1x1-ramp.png", ["https://i.postimg.cc/c1RshnFt/stage-w-2Ramp-side-min.png"]],
];

const CLIENT_DIR = resolve(__dirname, "..", "src", "assets", "clients");
const CLIENT_ASSETS = [
  ["rolls-royce.png", [`${WP}/2023/05/Rolls-Royce-Logo.png`]],
  ["bbc-philharmonic.png", [`${WP}/2023/05/bbc-philharmonic.png`]],
  ["bafta.png", [`${WP}/2023/05/bafta-uses-nexgen-staging-e1633878207934.png`]],
  ["chivas-bros.png", [`${WP}/2023/05/chivas-bros-1.png`]],
  ["lloyds.png", [`${WP}/2023/05/lloyds-1.png`]],
  ["itv-news.jpg", [`${WP}/2023/05/ITV-News.jpg`]],
  ["marlborough-college.png", [`${WP}/2023/05/marlborough-college-1.png`]],
];

const GALLERY_DIR = resolve(__dirname, "..", "src", "assets", "gallery");
const GALLERY_ASSETS = [
  ["usp-60s.png", [`${WP}/2023/09/OPT-Stage-Assembley.png`]],
  ["usp-nolocks.png", [`${WP}/2025/08/cbe4fb15-c929-4e30-9e1a-1d4327c6d72a.jpeg`]],
  ["usp-ukmade.jpg", [`${WP}/2025/05/IMG_9885-scaled.jpeg`]],
  ["usp-eco.png", [`${WP}/2025/08/DanceFloor-Deck-Platforms-2.png`]],
  ["usp-lifespan.jpg", [`${WP}/2023/05/IMG_3480-scaled.jpeg`]],
];

/** Smallest valid 1x1 images, used only if a download fails, so builds never break. */
const FALLBACK = {
  ".png": Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  ),
  ".jpg": Buffer.from(
    "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==",
    "base64",
  ),
  ".jpeg": Buffer.from(
    "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==",
    "base64",
  ),
};

const MIN_BYTES = 2048; // treat anything smaller as "not a real image"
const MIN_LOGO_BYTES = 800;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(url, minBytes = MIN_BYTES) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength < minBytes) throw new Error(`too small (${buf.byteLength}B)`);
  return buf;
}

async function fetchSet(dir, assets, minBytes) {
  const { statSync } = await import("node:fs");
  mkdirSync(dir, { recursive: true });
  let kept = 0,
    fetched = 0,
    fellBack = 0;
  const failures = [];

  for (const [name, urls] of assets) {
    const dest = resolve(dir, name);
    if (existsSync(dest) && statSync(dest).size >= minBytes) {
      kept++;
      continue;
    }
    let ok = false;
    for (const url of urls) {
      try {
        writeFileSync(dest, await download(url, minBytes));
        fetched++;
        ok = true;
        break;
      } catch {
        await sleep(250);
      }
    }
    if (!ok) {
      const ext = name.slice(name.lastIndexOf("."));
      writeFileSync(dest, FALLBACK[ext] ?? FALLBACK[".jpg"]);
      fellBack++;
      failures.push(name);
    }
  }
  return { kept, fetched, fellBack, failures, total: assets.length };
}

async function main() {
  const products = await fetchSet(OUT_DIR, ASSETS, MIN_BYTES);
  const clients = await fetchSet(CLIENT_DIR, CLIENT_ASSETS, MIN_LOGO_BYTES);
  const gallery = await fetchSet(GALLERY_DIR, GALLERY_ASSETS, MIN_BYTES);
  const kept = products.kept + clients.kept + gallery.kept;
  const fetched = products.fetched + clients.fetched + gallery.fetched;
  const fellBack = products.fellBack + clients.fellBack + gallery.fellBack;
  const failures = [...products.failures, ...clients.failures, ...gallery.failures];
  const total = products.total + clients.total + gallery.total;

  console.log(`[fetch-images] kept=${kept} downloaded=${fetched} placeholder=${fellBack} of ${total}`);

  if (failures.length) {
    console.warn(
      `[fetch-images] WARNING: placeholder written for: ${failures.join(", ")}\n` +
        `             Re-run this script with network access, or commit the real files to git.`,
    );
  }
}

main().catch((err) => {
  console.error("[fetch-images] fatal:", err.message);
  process.exit(1);
});
