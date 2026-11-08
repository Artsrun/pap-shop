import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Product } from '@/lib/content'
import type { Dict } from '@/lib/dict'
import { money, type Locale } from '@/lib/i18n'

// Pure building blocks in Lusine's markup: no data fetching, safe in Server and Client Components.

/** 1 → "01" */
export const pad = (n: number) => String(n).padStart(2, '0')

type PicProps = { src: string; sizes: string; alt?: string; eager?: boolean }

/** Photo from /public/img (name without .jpg), filling its box. */
export const Pic = ({ src, sizes, alt = '', eager }: PicProps) => (
  <Image
    src={`/img/${src}.jpg`}
    alt={alt}
    fill
    sizes={sizes}
    {...(eager && { loading: 'eager' as const, fetchPriority: 'high' as const })}
  />
)

/** <figure> with a photo: Lusine's boxes (.hero__img, .world figure, .strip figure…) set the size. */
export const Fig = ({ className, ...p }: PicProps & { className?: string }) => (
  <figure className={className}>
    <Pic {...p} />
  </figure>
)

/** Neutral 4:5 photo box (product gallery, cart). */
export const Photo = ({ className = '', ...p }: PicProps & { className?: string }) => (
  <div className={`ph ${className}`}>
    <Pic {...p} />
  </div>
)

type CtaProps = { href: string; plain?: boolean; small?: boolean; className?: string; children: ReactNode }

/** Black button = main action, plain = secondary. External links open in a new tab. */
export const Cta = ({ href, plain, small, className = '', children }: CtaProps) => {
  const cls = `btn${plain ? '' : ' btn--acid'}${small ? '' : ' btn--lg'} ${className}`.trim()
  return href.startsWith('http') ? (
    <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  ) : (
    <Link className={cls} href={href}>
      {children} {href.startsWith('#') ? '↓' : '→'}
    </Link>
  )
}

/** Grey title bar with a number: "Selected works 04". */
export const Band = ({ title, count, link }: { title: string; count?: number; link?: { href: string; label: string } }) => (
  <div className="band">
    <h2 className="display">
      {title} {count !== undefined && <span className="label">{pad(count)}</span>}
    </h2>
    {link && (
      <Link className="link" href={link.href}>
        {link.label} →
      </Link>
    )}
  </div>
)

/** Numbered cells; `steps` adds the arrows between them. */
export const Cells = ({ items, steps }: { items: string[]; steps?: boolean }) => (
  <section className={steps ? 'cells steps' : 'cells'}>
    {items.map((x, i) => (
      <div key={x} className="cell rv">
        <span className="num">{pad(i + 1)}</span>
        <b>{x}</b>
      </div>
    ))}
  </section>
)

type FeatureProps = { photo: string; alt?: string; title: string; text: string; children?: ReactNode }

/** Square photo + text block. */
export const Feature = ({ photo, alt, title, text, children }: FeatureProps) => (
  <section className="feature">
    <Fig className="rv" src={photo} alt={alt} sizes="(max-width: 680px) 100vw, 50vw" />
    <div className="rv">
      <h2 className="display">{title}</h2>
      <p>{text}</p>
      {children && <div className="row">{children}</div>}
    </div>
  </section>
)

/** Three square studio photos in a row. */
export const Strip = ({ photos, label }: { photos: [src: string, alt: string][]; label?: string }) => (
  <section className="strip" aria-label={label}>
    {photos.map(([src, alt]) => (
      <Fig key={src} className="rv" src={src} alt={alt} sizes="33vw" />
    ))}
  </section>
)

type TileProps = { href: string; photo: string; title: string; note?: string }

/** Grid tile for works and products (.works / .works--3). */
export const WorkTile = ({ href, photo, title, note }: TileProps) => (
  <Link className="work rv" href={href}>
    <Fig src={photo} alt={title} sizes="(max-width: 1000px) 50vw, 33vw" />
    <span>
      {title} <i>→</i>
    </span>
    {note && <small>{note}</small>}
  </Link>
)

type Chip = { href: string; label: string; current?: boolean }

/** Category filter row: real links, so every filter has its own URL. */
export const Chips = ({ label, items }: { label: string; items: Chip[] }) => (
  <nav className="chips" aria-label={label}>
    {items.map((i) => (
      <Link key={i.href} className="chip" href={i.href} aria-current={i.current ? 'page' : undefined}>
        {i.label}
      </Link>
    ))}
  </nav>
)

export const priceLabel = (p: Product, lang: Locale, t: Dict['shop']) =>
  p.stock < 1 ? t.soldOut : p.price === null ? t.onRequest : money(p.price, lang)
