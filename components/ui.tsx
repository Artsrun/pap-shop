import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Product, Work } from '@/lib/content'
import type { Dict } from '@/lib/dict'
import { href, money, tr, type Locale } from '@/lib/i18n'

// Pure building blocks: no data fetching, safe in Server and Client Components.

type PhotoProps = { src: string; sizes: string; alt?: string; eager?: boolean; className?: string }

export const Photo = ({ src, sizes, alt = '', eager, className = '' }: PhotoProps) => (
  <div className={`ph ${className}`}>
    <Image
      src={`/img/${src}.jpg`}
      alt={alt}
      fill
      sizes={sizes}
      {...(eager && { loading: 'eager' as const, fetchPriority: 'high' as const })}
    />
  </div>
)

type CtaProps = { href: string; kind?: 'ink' | 'alt' | 'buy'; children: ReactNode }

/** ink = commission journey, buy = shop journey, alt = secondary. */
export const Cta = ({ href, kind = 'ink', children }: CtaProps) => (
  <Link className={`btn ${kind}`} href={href}>
    {children}
    {kind !== 'buy' && <span aria-hidden="true">→</span>}
  </Link>
)

type HeroProps = { title: string; text: string; photo: string; alt?: string; children?: ReactNode }

export const Hero = ({ title, text, photo, alt, children }: HeroProps) => (
  <section className="hero">
    <Photo src={photo} alt={alt} sizes="(max-width: 860px) 100vw, 50vw" eager className="hero-ph" />
    <div className="hero-txt">
      <h1>{title}</h1>
      <p className="lead">{text}</p>
      {children && <div className="actions">{children}</div>}
    </div>
  </section>
)

export const Section = ({ title, className = '', children }: { title?: string; className?: string; children: ReactNode }) => (
  <section className={`sec wrap ${className}`}>
    {title && <h2>{title}</h2>}
    {children}
  </section>
)

export const Tags = ({ items }: { items: string[] }) => (
  <ul className="tags">
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
)

export const Steps = ({ items }: { items: string[] }) => (
  <ol className="steps">
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ol>
)

const cardSizes = '(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw'

export const WorkCard = ({ work, lang }: { work: Work; lang: Locale }) => (
  <Link className="card" href={href(lang, `/art/${work.slug}`)}>
    <Photo src={work.photos[0]} sizes={cardSizes} />
    <span>{tr(work.title, lang)}</span>
  </Link>
)

export const priceLabel = (p: Product, lang: Locale, t: Dict['shop']) =>
  p.stock < 1 ? t.soldOut : p.price === null ? t.onRequest : money(p.price, lang)

export const ProductCard = ({ p, lang, t }: { p: Product; lang: Locale; t: Dict['shop'] }) => (
  <Link className="card" href={href(lang, `/shop/p/${p.slug}`)}>
    <Photo src={p.photos[0]} sizes={cardSizes} />
    <span>{tr(p.title, lang)}</span>
    <small>
      {priceLabel(p, lang, t)}
      {p.kind === 'unique' && ` · ${t.unique}`}
    </small>
  </Link>
)
