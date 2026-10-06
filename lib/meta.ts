import type { Metadata } from 'next'
import { href, locales, type Locale } from './i18n'

/** Title + canonical + hreflang alternates for a locale-free path. */
export const pageMeta = (lang: Locale, path: string, title?: string, description?: string): Metadata => ({
  title,
  description,
  alternates: {
    canonical: href(lang, path),
    languages: { ...Object.fromEntries(locales.map((l) => [l, href(l, path)])), 'x-default': href('en', path) },
  },
})
