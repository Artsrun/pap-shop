'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import type { Dict } from '@/lib/dict'
import { money, type Locale } from '@/lib/i18n'
import { mailto } from '@/lib/site'
import { Photo } from './ui'

// Cart = { slug: qty } in localStorage, shared across tabs. No library, no provider.

type Lines = Record<string, number>
const KEY = 'rp-cart'
const EMPTY: Lines = {}
const subs = new Set<() => void>()
let cache: Lines | null = null

const read = (): Lines => {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return v && typeof v === 'object' ? (v as Lines) : {}
  } catch {
    return {}
  }
}

const snapshot = () => (cache ??= read())

const subscribe = (fn: () => void) => {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    cache = null
    fn()
  }
  subs.add(fn)
  window.addEventListener('storage', onStorage)
  return () => {
    subs.delete(fn)
    window.removeEventListener('storage', onStorage)
  }
}

export const setQty = (slug: string, qty: number) => {
  const next = { ...snapshot() }
  if (qty > 0) next[slug] = qty
  else delete next[slug]
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // private mode: cart lives for this page view only
  }
  subs.forEach((fn) => fn())
}

export const useCart = () => useSyncExternalStore(subscribe, snapshot, () => EMPTY)

export const CartLink = ({ href, label }: { href: string; label: string }) => {
  const count = Object.values(useCart()).reduce((a, b) => a + b, 0)
  const name = count ? `${label} (${count})` : label
  return (
    <Link className="btn btn--icon cart-btn" href={href} aria-label={name} title={name}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M5 8h14l-1 13H6L5 8z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 && <b>{count}</b>}
    </Link>
  )
}

type AddProps = { slug: string; stock: number; cartHref: string; t: Pick<Dict['shop'], 'add' | 'added'> }

export const AddToCart = ({ slug, stock, cartHref, t }: AddProps) =>
  useCart()[slug] ? (
    <Link className="btn btn--acid btn--lg" href={cartHref}>
      {t.added} →
    </Link>
  ) : (
    <button className="btn btn--acid btn--lg" type="button" disabled={stock < 1} onClick={() => setQty(slug, 1)}>
      {t.add}
    </button>
  )

export type CartItem = { slug: string; title: string; price: number; stock: number; photo: string; href: string }

export const CartView = ({ items, lang, t }: { items: CartItem[]; lang: Locale; t: Dict['cart'] }) => {
  const cart = useCart()
  const lines = items.filter((i) => cart[i.slug]).map((i) => ({ ...i, qty: Math.min(cart[i.slug], i.stock) }))
  if (!lines.length) return <p className="empty">{t.empty}</p>

  const total = lines.reduce((sum, l) => sum + l.qty * l.price, 0)
  const order = [...lines.map((l) => `${l.qty} × ${l.title} — ${money(l.qty * l.price, lang)}`), `${t.total}: ${money(total, lang)}`]

  return (
    <>
      <ul className="lines">
        {lines.map((l) => (
          <li key={l.slug}>
            <Photo src={l.photo} sizes="96px" />
            <Link href={l.href}>{l.title}</Link>
            {l.stock > 1 && (
              <input
                type="number"
                min={1}
                max={l.stock}
                value={l.qty}
                aria-label={t.qty}
                onChange={(e) => setQty(l.slug, Math.min(l.stock, Math.max(1, Number(e.target.value) || 1)))}
              />
            )}
            <span>{money(l.qty * l.price, lang)}</span>
            <button className="link" type="button" onClick={() => setQty(l.slug, 0)}>
              {t.remove}
            </button>
          </li>
        ))}
      </ul>
      <p className="total">
        {t.total} <b>{money(total, lang)}</b>
      </p>
      <div className="row">
        <a className="btn btn--acid btn--lg" href={mailto(t.subject, order.join('\n'))}>
          {t.send} →
        </a>
      </div>
      <p className="note">{t.note}</p>
    </>
  )
}
