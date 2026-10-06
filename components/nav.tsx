'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { basePath, href, localeNames, locales, type Locale } from '@/lib/i18n'

type NavProps = { lang: Locale; items: { path: string; label: string }[]; menu: string }

/** Inline links on desktop; a native popover sheet on phones (no JS needed to open it). */
export const Nav = ({ lang, items, menu }: NavProps) => {
  const path = basePath(usePathname())
  const ref = useRef<HTMLElement>(null)

  // client navigation keeps the layout mounted, so close the sheet on route change
  useEffect(() => {
    try {
      ref.current?.hidePopover()
    } catch {
      // not open, or popover unsupported
    }
  }, [path])

  return (
    <>
      <button className="menu-btn" type="button" popoverTarget="site-nav">
        {menu}
      </button>
      <nav id="site-nav" popover="auto" ref={ref}>
        {items.map((i) => (
          <Link
            key={i.path}
            href={href(lang, i.path)}
            aria-current={path === i.path || path.startsWith(`${i.path}/`) ? 'page' : undefined}
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </>
  )
}

/** Plain links on purpose: a full page load lets the proxy remember the choice. */
export const LangSwitch = ({ lang, label }: { lang: Locale; label: string }) => {
  const path = basePath(usePathname())
  return (
    <details className="lang">
      <summary aria-label={label}>{lang.toUpperCase()}</summary>
      <ul>
        {locales.map((l) => (
          <li key={l}>
            <a href={`/${l}${path === '/' ? '' : path}`} hrefLang={l} lang={l} aria-current={l === lang || undefined}>
              {localeNames[l]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
