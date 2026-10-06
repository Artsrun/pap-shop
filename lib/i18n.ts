export const locales = ['en', 'hy', 'ru'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = { en: 'English', hy: 'Հայերեն', ru: 'Русский' }

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v)

/** Localised text: English is required, the rest fall back to it. */
export type L = { en: string } & Partial<Record<Locale, string>>
export const tr = (text: L, lang: Locale) => text[lang] ?? text.en

/** English lives at the root (/tiles), the others are prefixed (/hy/tiles). */
export const href = (lang: Locale, path = '/') =>
  lang === 'en' ? path : `/${lang}${path === '/' ? '' : path}`

const prefixed = new RegExp(`^/(${locales.join('|')})(?=/|$)`)

/**
 * Locale-free path: /hy/tiles -> /tiles. Also strips /en, which only the server sees
 * (English is a proxy rewrite), so server and client render the same markup.
 */
export const basePath = (path: string) => path.replace(prefixed, '') || '/'

export const money = (amd: number, lang: Locale) =>
  new Intl.NumberFormat(lang, { style: 'currency', currency: 'AMD', maximumFractionDigits: 0 }).format(amd)
