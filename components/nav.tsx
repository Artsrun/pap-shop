'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { basePath, href, localeNames, locales, type Locale } from '@/lib/i18n'
import { pad } from './ui'

const codes: Record<Locale, string> = { en: 'ENG', hy: 'ARM', ru: 'RUS', de: 'DEU' }

const isCurrent = (path: string, item: string) => path === item || path.startsWith(`${item}/`)

/** Plain links on purpose: a full page load lets the proxy remember the choice. */
const LangSwitch = ({ lang, path, label }: { lang: Locale; path: string; label: string }) => (
  <details className="lang">
    <summary aria-label={label}>{codes[lang]}</summary>
    <div>
      {locales.map((l) => (
        <a key={l} href={`/${l}${path === '/' ? '' : path}`} hrefLang={l} lang={l} aria-current={l === lang || undefined}>
          {localeNames[l]}
          {l === lang && (
            <svg className="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          )}
        </a>
      ))}
    </div>
  </details>
)

type HeaderProps = {
  lang: Locale
  sub: string
  labels: { main: string; menu: string; language: string }
  items: { path: string; label: string }[]
  /** dropdown under the first item (restaurants), rendered on the server */
  mega: ReactNode
  /** theme, shop, cart */
  tools: ReactNode
}

/** Lusine's header: mega menu on desktop, burger list on tablets/phones, hides while scrolling down. */
export const SiteHeader = ({ lang, sub, labels, items, mega, tools }: HeaderProps) => {
  const path = basePath(usePathname())
  const ref = useRef<HTMLElement>(null)
  // the burger list belongs to the page it was opened on: navigating closes it, no effect needed
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === path
  const openRef = useRef(open)
  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    const header = ref.current
    if (!header) return
    const small = matchMedia('(max-width: 1000px)')
    let last = scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = scrollY
      const delta = y - last
      if (Math.abs(delta) < 8) return // ignore jitter and iOS bounce
      last = y
      header.toggleAttribute('data-hidden', small.matches && delta > 0 && y > header.offsetHeight * 2 && !openRef.current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // a new page always starts with the header visible
  useEffect(() => ref.current?.removeAttribute('data-hidden'), [path])

  const link = (i: { path: string; label: string }) => (
    <Link key={i.path} href={href(lang, i.path)} aria-current={isCurrent(path, i.path) ? 'page' : undefined}>
      {i.label}
    </Link>
  )

  return (
    <header className="site" ref={ref}>
      <div className="bar">
        <div className="brand">
          <Link className="logo" href={href(lang, '/')}>
            <b>RUBEN PAP</b>
            <small className="label">{sub}</small>
          </Link>
          <span className="sep" aria-hidden="true" />
          <LangSwitch lang={lang} path={path} label={labels.language} />
        </div>
        <nav className="main" aria-label={labels.main}>
          {items.map((i, n) =>
            n === 0 ? (
              <div key={i.path} className="has-mega">
                {link(i)}
                {mega}
              </div>
            ) : (
              link(i)
            ),
          )}
        </nav>
        <div className="actions">
          {tools}
          <button
            className="btn btn--icon burger"
            type="button"
            aria-label={labels.menu}
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpenOn(open ? null : path)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      <nav className="mnav" id="mnav" aria-label={labels.menu} hidden={!open}>
        {items.map((i, n) => (
          <Link
            key={i.path}
            href={href(lang, i.path)}
            aria-current={isCurrent(path, i.path) ? 'page' : undefined}
            onClick={() => setOpenOn(null)}
          >
            <span>{pad(n + 1)}</span>
            {i.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
