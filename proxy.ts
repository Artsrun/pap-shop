import { NextResponse, type NextRequest } from 'next/server'
import { isLocale, type Locale } from '@/lib/i18n'

// URLs: English at the root (/tiles), others prefixed (/hy/tiles).
// Choice order, like the old site: explicit pick (cookie) → browser language → English.

const COOKIE = 'lang'
const YEAR = 60 * 60 * 24 * 365

const remember = (res: NextResponse, lang: Locale) => {
  res.cookies.set(COOKIE, lang, { path: '/', maxAge: YEAR, sameSite: 'lax' })
  return res
}

const preferred = (req: NextRequest): Locale => {
  const saved = req.cookies.get(COOKIE)?.value
  if (saved && isLocale(saved)) return saved
  for (const part of (req.headers.get('accept-language') ?? '').split(',')) {
    const code = part.trim().slice(0, 2).toLowerCase()
    if (isLocale(code)) return code
  }
  return 'en'
}

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl
  const first = pathname.split('/')[1]
  const url = req.nextUrl.clone()

  // /en/... is never canonical; the language switcher uses it to pick English
  if (first === 'en') {
    url.pathname = pathname.slice(3) || '/'
    return remember(NextResponse.redirect(url), 'en')
  }

  if (isLocale(first)) {
    const res = NextResponse.next()
    return req.cookies.get(COOKIE)?.value === first ? res : remember(res, first)
  }

  const lang = preferred(req)
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`
  return lang === 'en' ? NextResponse.rewrite(url) : NextResponse.redirect(url)
}

export const config = {
  // skip API routes, Next internals and files (anything with a dot: /img/x.jpg, /sitemap.xml)
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
}
