# Ruben Pap Ceramics: v2

Next.js 16 (App Router), React 19, TypeScript and plain CSS. No UI, CSS or state libraries.
The site has four worlds (Restaurants, Art & Decor, Tiles and Shop) in four languages (EN · HY · RU · DE).
The old site ([ruben-pap](https://github.com/Artsrun/ruben-pap)) stays live until the domain moves.

## Two journeys, kept apart

- **Ready-made:** `/shop` → product → cart → order. The order goes by email until a checkout provider is chosen.
- **Commission:** Restaurants / Art & Decor / Tiles → `/commission?type=restaurant|art|tiles|custom&ref=<slug>` → email to the studio.

The button styles follow the journey: the turquoise pill is for the shop, the ink button with → is for a commission.

## Structure

```
app/[lang]/…              pages. English lives at /, the other languages under /hy /ru /de
app/api/commission        form → email (Resend). Without a key it answers 503 and the form offers a prefilled email
app/sitemap.ts            every page × 4 languages, with hreflang
proxy.ts                  language: saved choice (cookie) → browser language → English
components/ui.tsx         pure blocks (Photo, Cta, Hero, cards)
components/blocks.tsx     server blocks (Band, ShopGrid, ProjectGrid, ProjectDetail)
components/nav.tsx        menu (native popover on phones) + language switch
components/cart.tsx       localStorage cart (useSyncExternalStore), CartLink, AddToCart, CartView
components/commission-form.tsx
lib/content.ts            ← works, shop products, projects (seed data from the old site)
lib/dict.ts               ← every text; `en` is the source, the other languages override it
lib/site.ts               ← contacts (same values as the old config.js)
public/img, public/fonts  photos and self-hosted fonts (no Google requests)
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

## Deploy

Vercel: import the repo (framework preset: Next.js) and add the env vars. The proxy, the API route and the static pages need no extra config.

## Not done yet

- [ ] Checkout provider (Stripe / Shopify / an Armenian gateway). The cart currently sends the order by email.
- [ ] Real prices, availability, dimensions and stories (the seed data marks every piece as one-of-a-kind, price on request)
- [ ] Restaurant and tile case studies, with photos
- [ ] Port the 3D configurator from ruben-pap
- [ ] Native-speaker review of the HY / RU / DE texts
- [ ] Currency switch (AMD / USD / EUR); uploads larger than 4 MB (direct to storage)
