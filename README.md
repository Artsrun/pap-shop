# Ruben Pap Ceramics: v3

Next.js 16 (App Router), React 19, TypeScript and plain CSS. No UI, CSS or state libraries.
v3 = Lusine's Claude Design (`app/lusine.css`, verbatim) on top of the v2 functionality.

**Editing manual (texts, photos, products, restaurants, design, publishing):** https://claude.ai/code/artifact/c51301cb-d870-4e58-983b-1e2b1e8ab14c
The site has four worlds (Restaurants, Art & Decor, Tiles and Shop) in three languages (EN · HY · RU; German was dropped for now, restore it from git history).
The old site ([ruben-pap](https://github.com/Artsrun/ruben-pap)) stays live until the domain moves.

## Two journeys, kept apart

- **Ready-made:** `/shop` → product → cart → order. The order goes by email until a checkout provider is chosen.
- **Commission:** Restaurants / Art & Decor / Tiles → `/commission?type=restaurant|art|tiles|custom&ref=<slug>` → email to the studio.

Buttons: black (`btn--acid`) = the main action on a page, outlined = secondary.

## Structure

```
app/[lang]/…              pages. English lives at /, the other languages under /hy /ru
app/api/commission        form → email (Resend). Without a key it answers 503 and the form offers a prefilled email
app/sitemap.ts            every page × 3 languages, with hreflang
proxy.ts                  language: saved choice (cookie) → browser language → English
app/lusine.css            ← Lusine's design system (tokens, type, every section)
app/v3.css                additions: cart/product/form/3D styles, mobile title overlay, header hide-on-scroll
app/fonts.css             self-hosted JetBrains Mono, Noto Sans Armenian, Noto Sans (Cyrillic)
components/ui.tsx         pure blocks in Lusine's markup (Band, Cells, Feature, Strip, Cta, WorkTile, Chips)
components/blocks.tsx     server blocks (PHero, CommissionCta, RestosList, Carousel, ProjectDetail, ArtGrid, ShopGrid)
components/nav.tsx        header: mega menu, language menu, burger, hide-on-scroll
components/fx.tsx         reveal on scroll, theme toggle, carousel arrows
components/cart.tsx       localStorage cart (useSyncExternalStore), CartLink, AddToCart, CartView
components/commission-form.tsx
components/configurator/    3D configurator: React UI + viewer3d.js (three.js, ported unchanged from ruben-pap)
lib/pieces.ts             ← 3D pieces: S/M/L sizes (approximate!), shapes, glazes
lib/content.ts            ← works, shop products, restaurant case studies
lib/dict.ts               ← every text; `en` is the source, the other languages override it
lib/site.ts               ← contacts (same values as the old config.js)
public/img, public/fonts  photos and fonts (no Google requests)
```

## Run

```sh
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY` for the form to send email.

## Content

- **Prices:** set `price` (AMD) on a product in `lib/content.ts`. `null` shows "Price on request" and an "Ask about this piece" email link instead of Add to cart.
- **Categories:** a shop product has one `category` (`kind` covers Limited Editions / One-of-a-Kind). An artwork has `categories` (`sculptural · vases · objects · interior · experimental · limited`, several allowed). Only categories that have something in them get a filter chip and a sitemap entry; empty ones still open (`/shop/cups`, `/art/c/interior`).
- **Case studies:** add them to `projects`. They appear at `/restaurants/<slug>` or `/tiles/<slug>`.
- **Texts:** `lib/dict.ts`. A missing translation falls back to English.

## 3D configurator

`/art/customize`: pick a piece, S/M/L, a glaze and the surface; the choices become a ready-to-send message.
Shared designs: `/art/customize?p=02&s=l&g=turquoise&f=60&t=30&l=80`. three.js loads only when the 3D view is near the screen.
Replace the approximate `sizes` in `lib/pieces.ts` with real measurements.

## Deploy

Vercel: import the repo (framework preset: Next.js) and add the env vars. The proxy, the API route and the static pages need no extra config.

## Not done yet

- [ ] Checkout provider (Stripe / Shopify / an Armenian gateway). The cart currently sends the order by email.
- [ ] Real prices, availability, dimensions and stories (the seed data marks every piece as one-of-a-kind, price on request)
- [ ] Tile case studies, with photos
- [ ] Native-speaker review of the HY / RU texts
- [ ] Currency switch (AMD / USD / EUR); uploads larger than 4 MB (direct to storage)
