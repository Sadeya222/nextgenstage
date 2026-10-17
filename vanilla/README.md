# NexGen Portable Staging — HTML / CSS / JavaScript build

A dependency-free port of the original React + TypeScript site. Everything here runs
directly in the browser: no React, no TypeScript, no bundler, no runtime JavaScript
dependencies.

## Run it

Open `index.html` directly, or serve the folder:

```bash
cd vanilla
python3 -m http.server 8000
# http://localhost:8000
```

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | The whole page (header, hero, configurator, trust cards, shop, videos, reviews, SEO content, FAQ, footer, overlays) plus JSON-LD structured data. |
| `css/styles.css` | Compiled Tailwind v4 output — the original design tokens, utilities, keyframes and custom `@utility` classes. |
| `css/custom.css` | Small interaction layer: dialog transitions, scroll reveal, hero entrance, build bar, back-to-top. |
| `js/data.js` | All site copy and product/review/FAQ data (`window.NX_DATA`). |
| `js/icons.js` | Lucide icon paths used by dynamically rendered UI. |
| `js/app.js` | All behaviour: hero slider, stage configurator + isometric preview, cart, funding & quote forms, search, video lightbox, review carousel, FAQ accordion, newsletter, back-to-top, dialogs with focus trapping. |

## Notes

- Product, hero and client-logo imagery is loaded from the same live URLs as the
  original site. If a URL cannot be fetched (offline, or a CDN block), a styled
  branded placeholder is swapped in automatically so the layout never breaks.
- The environment-specific bits (ECAL funding, quote and newsletter forms) log to the
  console instead of calling a backend, exactly like the original prototype.
- `css/tailwind-source.css` is the source for `styles.css`. Rebuild after editing HTML
  classes with `npx @tailwindcss/cli@4.1.17 -i css/tailwind-source.css -o css/styles.css --minify`
  (run from the repository root so the `@source` paths resolve).
