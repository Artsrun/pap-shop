import type { L, Locale } from './i18n'
import { href, tr } from './i18n'

// Seed data from the current site. Confirm availability, add prices, dimensions and stories before launch.

export const categories = ['cups', 'mugs', 'plates', 'bowls', 'vases', 'decor', 'limited', 'unique'] as const
export type Category = (typeof categories)[number]

export const projectTypes = ['restaurant', 'art', 'tiles', 'custom'] as const
export type ProjectType = (typeof projectTypes)[number]
export const isProjectType = (v: unknown): v is ProjectType => projectTypes.includes(v as ProjectType)

export type Work = {
  slug: string
  title: L
  photos: string[] // file names in /public/img, without .jpg
  year?: number
  collection?: L
  material?: L
  dimensions?: string
  story?: L
  product?: string // shop slug while it is for sale
}

export type Product = {
  slug: string
  title: L
  category: Exclude<Category, 'limited' | 'unique'>
  kind: 'unique' | 'limited' | 'repeatable'
  price: number | null // AMD; null = "price on request", not addable to cart
  stock: number
  photos: string[]
  glaze?: L
  material?: L
  dimensions?: string
  care?: L
  work?: string // Art & Decor slug
}

export type Project = {
  slug: string
  kind: 'restaurant' | 'tiles'
  name: string
  city: string
  year: number
  cover: string
  gallery: string[]
  concept: L
  collection?: L // restaurant: pieces and counts
  tile?: L // tiles: shape, size
  pattern?: L
  materials?: L
}

const title = {
  ruffled: { en: 'Ruffled vase', hy: 'Ալիքաձև ծաղկաման', ru: 'Волнистая ваза', de: 'Gewellte Vase' },
  pierced: { en: 'Pierced bowl', hy: 'Ծակոտկեն թաս', ru: 'Ажурная чаша', de: 'Durchbrochene Schale' },
  tulip: { en: 'Tulip pot', hy: 'Վարդակակաչաձև անոթ', ru: 'Сосуд-тюльпан', de: 'Tulpengefäß' },
  folded: { en: 'Folded vase', hy: 'Ծալքավոր ծաղկաման', ru: 'Складчатая ваза', de: 'Gefaltete Vase' },
  wide: { en: 'Wide bowl', hy: 'Լայն թաս', ru: 'Широкая чаша', de: 'Weite Schale' },
  bronze: { en: 'Bronze vessel', hy: 'Բրոնզե անոթ', ru: 'Бронзовый сосуд', de: 'Bronzegefäß' },
} satisfies Record<string, L>

export const works: Work[] = [
  { slug: 'ruffled-vase', title: title.ruffled, photos: ['work-01'], product: 'ruffled-vase' },
  { slug: 'pierced-bowl', title: title.pierced, photos: ['work-02', 'work-08'], product: 'pierced-bowl' },
  { slug: 'tulip-pot', title: title.tulip, photos: ['work-03', 'work-07'], product: 'tulip-pot' },
  { slug: 'folded-vase', title: title.folded, photos: ['work-04'], product: 'folded-vase' },
  { slug: 'wide-bowl', title: title.wide, photos: ['work-05'], product: 'wide-bowl' },
  { slug: 'bronze-vessel', title: title.bronze, photos: ['work-06'], product: 'bronze-vessel' },
]

const unique = { kind: 'unique', price: null, stock: 1 } as const

export const products: Product[] = [
  { slug: 'ruffled-vase', title: title.ruffled, category: 'vases', photos: ['work-01'], work: 'ruffled-vase', ...unique },
  { slug: 'pierced-bowl', title: title.pierced, category: 'bowls', photos: ['work-02', 'work-08'], work: 'pierced-bowl', ...unique },
  { slug: 'tulip-pot', title: title.tulip, category: 'decor', photos: ['work-03', 'work-07'], work: 'tulip-pot', ...unique },
  { slug: 'folded-vase', title: title.folded, category: 'vases', photos: ['work-04'], work: 'folded-vase', ...unique },
  { slug: 'wide-bowl', title: title.wide, category: 'bowls', photos: ['work-05'], work: 'wide-bowl', ...unique },
  { slug: 'bronze-vessel', title: title.bronze, category: 'decor', photos: ['work-06'], work: 'bronze-vessel', ...unique },
]

export const projects: Project[] = []

export const inCategory = (p: Product, c: Category) =>
  c === 'limited' || c === 'unique' ? p.kind === c : p.category === c

export const projectHref = (lang: Locale, p: Project) =>
  href(lang, `/${p.kind === 'restaurant' ? 'restaurants' : 'tiles'}/${p.slug}`)

export const commissionHref = (lang: Locale, type?: ProjectType, ref?: string) => {
  const q = new URLSearchParams({ ...(type && { type }), ...(ref && { ref }) }).toString()
  return `${href(lang, '/commission')}${q ? `?${q}` : ''}`
}

/** Title of a product or work, for the commission form's "Reference" line. */
export const refTitle = (slug: string, lang: Locale) => {
  const item = products.find((p) => p.slug === slug) ?? works.find((w) => w.slug === slug)
  return item && tr(item.title, lang)
}
