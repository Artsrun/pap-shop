import type { MetadataRoute } from 'next'
import { categories, products, projectHref, projects, works } from '@/lib/content'
import { basePath, href, locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

const sitemap = (): MetadataRoute.Sitemap => {
  const paths = [
    '/',
    '/restaurants',
    '/art',
    '/tiles',
    '/shop',
    '/about',
    '/contact',
    '/commission',
    ...categories.map((c) => `/shop/${c}`),
    ...works.map((w) => `/art/${w.slug}`),
    ...products.map((p) => `/shop/p/${p.slug}`),
    ...projects.map((p) => basePath(projectHref('en', p))),
  ]
  const abs = (path: string) => new URL(path, siteUrl).toString()
  return paths.map((path) => ({
    url: abs(href('en', path)),
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, abs(href(l, path))])) },
  }))
}

export default sitemap
