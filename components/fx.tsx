'use client'

import { usePathname } from 'next/navigation'
import { useEffect, type MouseEvent } from 'react'

/** Fade-in for `.rv` elements (Lusine's reveal), re-armed on every client navigation. */
export const Reveal = () => {
  const path = usePathname()
  useEffect(() => {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = [...document.querySelectorAll<HTMLElement>('.rv:not(.in)')]
    els.forEach((el) => el.getBoundingClientRect().top < innerHeight && el.classList.add('in'))
    document.documentElement.classList.add('anim')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('in')
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el, i) => {
      if (el.classList.contains('in')) return
      el.style.transitionDelay = `${(i % 4) * 70}ms`
      io.observe(el)
    })
    // never leave anything hidden
    const t = setTimeout(() => els.forEach((el) => el.classList.add('in')), 2500)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [path])
  return null
}

const toggleTheme = () => {
  const root = document.documentElement
  const current = root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const next = current === 'dark' ? 'light' : 'dark'
  root.dataset.theme = next
  try {
    localStorage.setItem('rp-theme', next)
  } catch {
    // private mode: the choice lasts for this page view
  }
}

export const ThemeToggle = ({ label }: { label: string }) => (
  <button className="theme" type="button" aria-label={label} title={label} onClick={toggleTheme}>
    <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
    <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  </button>
)

const scroll = (dir: 1 | -1) => (e: MouseEvent<HTMLButtonElement>) => {
  const track = e.currentTarget.closest('[data-carousel]')?.querySelector('.car__track')
  track?.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' })
}

/** ← → buttons for a `.car` carousel (swipe works without them). */
export const CarButtons = ({ prev, next }: { prev: string; next: string }) => (
  <>
    <button className="theme car__btn" type="button" aria-label={prev} onClick={scroll(-1)}>
      ←
    </button>
    <button className="theme car__btn" type="button" aria-label={next} onClick={scroll(1)}>
      →
    </button>
  </>
)
