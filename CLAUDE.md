@AGENTS.md

# Ruben Pap Ceramics: notes for Claude

The main editor is Lusine, a UI/UX designer. She edits only through Claude Code and never opens GitHub herself.
Reply in the language she writes in (Armenian, Russian or English). Keep replies short and visual: what changed, plus the preview link.
Her full manual: https://claude.ai/code/artifact/c51301cb-d870-4e58-983b-1e2b1e8ab14c

## Workflow (every change)

1. Run `npm ci` once per session if `node_modules` is missing.
2. Work on a branch: use `v3` until v3 is merged; after that, a short new branch per task (`text-prices`, `new-restaurant-ararat`). Never commit to `main` unless she says "publish" / "make it live".
3. Make the change. Texts must exist in all 3 languages (en, hy, ru). Translate from whatever language she gives; flag translations you are unsure about.
4. Check before pushing: `npx tsc --noEmit && npm run lint && npm run build`. Never push a red build.
5. Push, then give her the preview link: `https://pap-shop-git-<branch>-artsruns-projects.vercel.app/<page>` (ready about 1 minute after the push; Vercel login may be asked). For a visual change, also screenshot the page at 390px and 1280px wide and show it to her.
6. "Publish" / "make it live" = open a pull request from the branch into `main` and merge it. `main` deploys to https://pap-shop.vercel.app.
7. "Undo" = `git revert` the commit(s) on the same branch and push. Never force-push and never rewrite history.

## Photos she attaches

Attached files are saved under `/root/.claude/uploads/…`. Copy each one to `public/img/<name>.jpg` (lowercase, hyphens, no spaces). Convert it to JPG, resize it to the size in the table below, quality 80, under ~500 KB. Python Pillow is usually available.
To replace a photo, keep its existing name. To add one, choose a new name and reference it in the data or page.

| Photo | Size |
| --- | --- |
| `v3-hero` | 1400×1050 |
| `v3-world-*`, strips `v3-studio-*` / `v3-tiles-1..3` | 720×720 |
| page-head photos `v3-tiles`, `v3-art`, `v3-shop`, `v3-about`, `v3-contact`, `v3-cta` | 800×1000 |
| restaurant cover `r-<slug>` | 1800×1000 |
| restaurant pieces `r-<slug>-1..3` | 720×900 |
| `logo-<slug>` | 168×168 or larger, square |
| works / products `work-NN` | 1000×1250 |

## Where things live

- `lib/dict.ts`: every interface text. `en` is the source; the `hy`/`ru` blocks override it section by section. A translated list replaces the English list completely.
- `lib/content.ts`: `works` (Art & Decor), `products` (Shop: `price` in AMD or `null`, `stock`), and `projects` (restaurant case studies; tiles projects use `kind: 'tiles'`).
- `lib/site.ts`: contacts. `lib/pieces.ts`: 3D sizes. `lib/cfg-dict.ts`: 3D texts.
- `app/lusine.css`: Lusine's design system, kept from her Claude Design export. Change the look here.
- `app/v3.css`: additions only (cart, product, form, 3D, mobile overlays).
- `components/ui.tsx`: pure blocks (`Band`, `Cells`, `Feature`, `Strip`, `Cta`, `WorkTile`, `Chips`).
- `components/blocks.tsx`: server blocks (`PHero`, `CommissionCta`, `RestosList`, `Carousel`, `KeepExploring`, `Live`, `Guide`, `ProjectDetail`, `ArtGrid`, `ShopGrid`).
- Pages: `app/[lang]/<page>/page.tsx`. English has no URL prefix; the other languages use `/hy` and `/ru`. German was dropped for now; old `/de` links redirect.
- New page: add a folder under `app/[lang]/`, its texts in all 3 languages, a line in `items` in `components/layout.tsx` if it belongs in the menu, and its path in `app/sitemap.ts`.

## Code rules

- Next.js 16 App Router, React 19, TypeScript, plain CSS. Add no UI, CSS-in-JS or state libraries. Load no Google fonts or scripts; fonts are self-hosted.
- Arrow functions, named exports for components, Lusine's class names and markup.
- Links: `href(lang, '/path')`. Form links: `commissionHref(lang, type, ref)`.
- Photos: `<Pic>`, `<Fig>` or `<Photo>` from `components/ui.tsx`, with the name without `.jpg`.
- In single-quoted strings, write apostrophes as ’ (typographic).
