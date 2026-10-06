import type { L, Locale } from './i18n'
import { href, tr } from './i18n'

// Seed data from the current site. Confirm availability, add prices, dimensions and stories before launch.

export const categories = ['cups', 'mugs', 'plates', 'bowls', 'vases', 'decor', 'limited', 'unique'] as const
export type Category = (typeof categories)[number]
export const isCategory = (v: string): v is Category => categories.includes(v as Category)

/** Art & Decor filters; a work can sit in several. "One of a kind" is a tag, not a category. */
export const artCategories = ['sculptural', 'vases', 'objects', 'interior', 'experimental', 'limited'] as const
export type ArtCategory = (typeof artCategories)[number]
export const isArtCategory = (v: string): v is ArtCategory => artCategories.includes(v as ArtCategory)

export const projectTypes = ['restaurant', 'art', 'tiles', 'custom'] as const
export type ProjectType = (typeof projectTypes)[number]
export const isProjectType = (v: unknown): v is ProjectType => projectTypes.includes(v as ProjectType)

export type Work = {
  slug: string
  title: L
  categories: ArtCategory[]
  unique?: boolean
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
  label: L // short line under the name: city or cuisine
  cover: string // wide photo for the page banner (file in /public/img, no .jpg)
  logo?: string
  instagram?: string // handle without @
  closed?: boolean
  year?: number
  concept: L // one-sentence description
  facts: { label: L; value: L }[] // "at a glance" cells
  pieces: { photo: string; work: string }[] // carousel: photo + the Art & Decor work it shows
}

const title = {
  ruffled: { en: 'Ruffled vase', hy: 'Ալիքաձև ծաղկաման', ru: 'Волнистая ваза' },
  pierced: { en: 'Pierced bowl', hy: 'Ծակոտկեն թաս', ru: 'Ажурная чаша' },
  tulip: { en: 'Tulip pot', hy: 'Վարդակակաչաձև անոթ', ru: 'Сосуд-тюльпан' },
  folded: { en: 'Folded vase', hy: 'Ծալքավոր ծաղկաման', ru: 'Складчатая ваза' },
  wide: { en: 'Wide bowl', hy: 'Լայն թաս', ru: 'Широкая чаша' },
  bronze: { en: 'Bronze vessel', hy: 'Բրոնզե անոթ', ru: 'Бронзовый сосуд' },
} satisfies Record<string, L>

// Categories below are a first pass from the photos: Ruben/Lusine to curate.
export const works: Work[] = [
  { slug: 'ruffled-vase', title: title.ruffled, categories: ['vases'], unique: true, photos: ['work-01'], product: 'ruffled-vase' },
  { slug: 'pierced-bowl', title: title.pierced, categories: ['objects', 'sculptural'], unique: true, photos: ['work-02', 'work-08'], product: 'pierced-bowl' },
  { slug: 'tulip-pot', title: title.tulip, categories: ['objects'], unique: true, photos: ['work-03', 'work-07'], product: 'tulip-pot' },
  { slug: 'folded-vase', title: title.folded, categories: ['vases', 'sculptural'], unique: true, photos: ['work-04'], product: 'folded-vase' },
  { slug: 'wide-bowl', title: title.wide, categories: ['objects'], unique: true, photos: ['work-05'], product: 'wide-bowl' },
  { slug: 'bronze-vessel', title: title.bronze, categories: ['sculptural', 'experimental'], unique: true, photos: ['work-06'], product: 'bronze-vessel' },
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

const yerevan = { en: 'Yerevan', hy: 'Երևան', ru: 'Ереван' }
const cuisine = { en: 'Cuisine', hy: 'Խոհանոց', ru: 'Кухня' }

// Restaurant case studies (content from Lusine's v3 design). Texts: hy original, en/ru translated.
export const projects: Project[] = [
  {
    slug: 'zula', kind: 'restaurant', name: 'Zula', label: yerevan, cover: 'r-zula', logo: 'logo-zula', instagram: 'zulayerevan',
    concept: {
      en: 'Modern Armenian cuisine, rooted in Armenian heritage and reimagined for today.',
      hy: 'Ժամանակակից հայկական խոհանոց՝ արմատավորված հայկական ժառանգության մեջ և վերաիմաստավորված այսօրվա համար։',
      ru: 'Современная армянская кухня, укоренённая в армянском наследии и переосмысленная для сегодняшнего дня.',
    },
    facts: [
      { label: cuisine, value: { en: 'Modern Armenian', hy: 'Ժամանակակից հայկական', ru: 'Современная армянская' } },
      { label: { en: 'Address', hy: 'Հասցե', ru: 'Адрес' }, value: { en: '11/1 Aram St, Yerevan', hy: 'Արամի փ. 11/1, Երևան', ru: 'ул. Арама 11/1, Ереван' } },
      { label: { en: 'Hours', hy: 'Ժամեր', ru: 'Часы' }, value: { en: '08:00 – 00:00' } },
    ],
    pieces: [{ photo: 'r-zula-1', work: 'wide-bowl' }, { photo: 'r-zula-2', work: 'wide-bowl' }, { photo: 'r-zula-3', work: 'wide-bowl' }],
  },
  {
    slug: 'kuwa-izakaya', kind: 'restaurant', name: 'Kuwa Izakaya', label: { en: 'Izakaya', hy: 'Իզակայա', ru: 'Идзакая' },
    cover: 'r-kuwa-izakaya', logo: 'logo-kuwa-izakaya', instagram: 'kuwaizakaya', closed: true,
    concept: {
      en: 'A Japanese izakaya with small plates and a table made for sharing.',
      hy: 'Ճապոնական իզակայա՝ փոքր ուտեստներով և կիսելու համար նախատեսված սեղանով։',
      ru: 'Японская идзакая с небольшими блюдами и столом, за которым принято делиться.',
    },
    facts: [
      { label: cuisine, value: { en: 'Japanese izakaya', hy: 'Ճապոնական իզակայա', ru: 'Японская идзакая' } },
      { label: { en: 'Status', hy: 'Կարգավիճակ', ru: 'Статус' }, value: { en: 'The restaurant is now closed', hy: 'Ռեստորանն այժմ փակ է', ru: 'Ресторан сейчас закрыт' } },
    ],
    pieces: [{ photo: 'r-kuwa-izakaya-1', work: 'pierced-bowl' }, { photo: 'r-kuwa-izakaya-2', work: 'pierced-bowl' }, { photo: 'r-kuwa-izakaya-3', work: 'pierced-bowl' }],
  },
  {
    slug: 'nor-aleppo', kind: 'restaurant', name: 'Nor Aleppo', label: yerevan, cover: 'r-nor-aleppo', logo: 'logo-nor-aleppo', instagram: 'noraleppo.yvn',
    concept: {
      en: 'Eastern cuisine with a rich mix of flavours, textures and aromas.',
      hy: 'Արևելյան խոհանոց՝ համերի, ֆակտուրաների և բույրերի հարուստ համադրությամբ։',
      ru: 'Восточная кухня с богатым сочетанием вкусов, текстур и ароматов.',
    },
    facts: [
      { label: cuisine, value: { en: 'Eastern', hy: 'Արևելյան', ru: 'Восточная' } },
      { label: { en: 'Address', hy: 'Հասցե', ru: 'Адрес' }, value: { en: '19/21 Saryan St, Yerevan', hy: 'Սարյան փ. 19/21, Երևան', ru: 'ул. Сарьяна 19/21, Ереван' } },
      { label: { en: 'Hours', hy: 'Ժամեր', ru: 'Часы' }, value: { en: '11:00 – 23:00' } },
    ],
    pieces: [{ photo: 'r-nor-aleppo-1', work: 'tulip-pot' }, { photo: 'r-nor-aleppo-2', work: 'tulip-pot' }, { photo: 'r-nor-aleppo-3', work: 'tulip-pot' }],
  },
  {
    slug: 'lavash-1', kind: 'restaurant', name: 'Lavash №1', label: { en: 'Dolgoprudny', hy: 'Դոլգոպրուդնի', ru: 'Долгопрудный' },
    cover: 'r-lavash-1', logo: 'logo-lavash-1', instagram: 'lavash.dol',
    concept: {
      en: 'Armenian cuisine with tradition and warmth, with banquet and VIP halls.',
      hy: 'Հայկական խոհանոց՝ ավանդույթներով և ջերմությամբ, բանկետային և VIP սրահներով։',
      ru: 'Армянская кухня с традициями и теплом, банкетным и VIP-залами.',
    },
    facts: [
      { label: cuisine, value: { en: 'Armenian', hy: 'Հայկական', ru: 'Армянская' } },
      { label: { en: 'City', hy: 'Քաղաք', ru: 'Город' }, value: { en: 'Dolgoprudny, Russia', hy: 'Դոլգոպրուդնի, Ռուսաստան', ru: 'Долгопрудный, Россия' } },
      { label: { en: 'Halls', hy: 'Սրահներ', ru: 'Залы' }, value: { en: 'Banquet · VIP', hy: 'Բանկետային · VIP', ru: 'Банкетный · VIP' } },
    ],
    pieces: [{ photo: 'r-lavash-1-1', work: 'ruffled-vase' }, { photo: 'r-lavash-1-2', work: 'wide-bowl' }, { photo: 'r-lavash-1-3', work: 'tulip-pot' }],
  },
]

export const inCategory = (p: Product, c: Category) =>
  c === 'limited' || c === 'unique' ? p.kind === c : p.category === c

// Only filled categories get a chip and a sitemap entry; empty ones still resolve (no 404s on old links).
export const filledCategories = categories.filter((c) => products.some((p) => inCategory(p, c)))
export const filledArtCategories = artCategories.filter((c) => works.some((w) => w.categories.includes(c)))

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
