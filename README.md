# NexGen Portable Staging — Homepage Redesign

Modern, high-converting e-commerce homepage for **NexGen Portable Staging**
(www.portablestage.co.uk) — React 19 + Vite + Tailwind CSS v4 + Lucide Icons + Framer Motion.

## Brand palette

| Token | Hex | Use |
| --- | --- | --- |
| Forest 900/800 | `#0A2A1A` / `#0E3823` | Dark backgrounds, headers, footer |
| Electric lime | `#A3E635` / `#84CC16` | CTAs, badges, highlights, glows |
| Slate | `#1E293B` / `#64748B` / `#F8FAFC` | Structural contrast & UI balance |
| White | `#FFFFFF` | Cards & readable surfaces |

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs dist/ (single self-contained index.html)
npm run preview  # serve the production build locally
```

## Deploy on Vercel

### Option A — Git (recommended)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects the **Vite** preset; `vercel.json` pins:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Click **Deploy**. Every push to `main` redeploys automatically; PRs get
   preview deployments.

### Option B — CLI

```bash
npm i -g vercel
vercel login
vercel          # preview deployment
vercel --prod   # production deployment
```

### Notes

- The build inlines JS, CSS, fonts and images into a single `dist/index.html`
  (via `vite-plugin-singlefile`), so the output is fully self-contained and works
  on any static host, including Vercel.
- `vercel.json` adds an SPA fallback rewrite and baseline security headers.
- Point your custom domain (`www.portablestage.co.uk`) at the project in
  **Vercel → Project → Settings → Domains**.

## Content sources (factual — portablestage.co.uk)

All copy, products, prices, imagery and contact details come from the live site:

- **Products & prices (inc VAT)** — `src/data/content.ts` → `PRODUCTS`
  (SteelCity & Platinum ECO modules, 3×2m–6×3m packages, 3-tier choir package,
  podiums, fascia/valance, handrails, trolleys, access ramp, backdrop kit…).
- **Product & category photos** — real images downloaded from the site into
  `src/assets/real/` (no placeholders).
- **Testimonials** — real customer comments from the homepage (Mrs. Jones,
  Mr. Smithe, Paula Frank, a Teacher and a UK school case study).
- **Videos** — the three real YouTube embeds in `VIDEO_TABS`
  (`src/components/VideoShowcase.tsx`): `o94G3BRJB4Q`, `13Scgq9p2kA`,
  `QtWte86aOso`, each with its real start offset.
- **Contact** — `BUSINESS` in `src/data/content.ts`:
  NexGen Staging Limited, SolPro Estate, Unit 12, Royds Mills, Windsor Street,
  Sheffield S4 7WB · 0114 399 2978 · enquiries@portablestage.co.uk.
- **ECAL funding** — up to 20% for Education, Charity, Arts & Leisure
  organisations (see `FUNDING_TIERS` / `ECAL_FACTS`).
- **Links** — root-relative paths matching the live site (`/shop/`,
  `/quote-me/`, `/product-category/…`, `/contact/`, `/about/`, `/blog`).

## Still to wire up before launch

- Checkout button is a design prototype; connect it to the live WooCommerce
  checkout.
- Video modal uses the real YouTube iframes with autoplay; verify playback on
  your domain (YouTube embeds work from any origin).
- Prices are shown exactly as displayed on the live shop (inc VAT where the
  shop shows inc VAT); re-sync `PRODUCTS` if prices change.
