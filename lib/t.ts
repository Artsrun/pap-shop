import { notFound } from 'next/navigation'
import { lang as rootLang } from 'next/root-params'
import { dict } from './dict'
import { isLocale } from './i18n'

/** Current locale + dictionary for any Server Component (no prop drilling). */
export const getT = async () => {
  const lang = await rootLang()
  if (!isLocale(lang)) notFound()
  return { lang, t: dict(lang) }
}
