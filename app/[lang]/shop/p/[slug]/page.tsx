import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToCart } from '@/components/cart'
import { Cta, Photo, priceLabel } from '@/components/ui'
import { commissionHref, products } from '@/lib/content'
import { href, tr } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { cfgDict } from '@/lib/cfg-dict'
import { pieceForWork } from '@/lib/pieces'
import { mailto } from '@/lib/site'
import { getT } from '@/lib/t'

export const dynamicParams = false
export const generateStaticParams = () => products.map(({ slug }) => ({ slug }))

const find = (slug: string) => products.find((p) => p.slug === slug)

export const generateMetadata = async ({ params }: PageProps<'/[lang]/shop/p/[slug]'>) => {
  const { lang } = await getT()
  const { slug } = await params
  const p = find(slug)
  return pageMeta(lang, `/shop/p/${slug}`, p && tr(p.title, lang))
}

const ProductPage = async ({ params }: PageProps<'/[lang]/shop/p/[slug]'>) => {
  const { lang, t } = await getT()
  const p = find((await params).slug)
  if (!p) notFound()

  const s = t.shop
  const piece3d = pieceForWork(p.work)
  const name = tr(p.title, lang)
  const details = [
    [s.material, p.material && tr(p.material, lang)],
    [s.glaze, p.glaze && tr(p.glaze, lang)],
    [s.dimensions, p.dimensions],
    [s.care, p.care && tr(p.care, lang)],
  ].filter(([, v]) => v)

  return (
    <section className="product">
      <div className="gallery">
        {p.photos.map((src, i) => (
          <Photo key={src} src={src} alt={name} sizes="(max-width: 860px) 100vw, 55vw" eager={i === 0} />
        ))}
      </div>
      <div className="buy">
        <p className="label">
          <Link href={href(lang, '/shop')}>{t.nav.shop}</Link> ·{' '}
          <Link href={href(lang, `/shop/${p.category}`)}>{s.cats[p.category]}</Link>
          {p.kind === 'unique' && ` · ${s.unique}`}
        </p>
        <h1 className="display">{name}</h1>
        <p className="price">{priceLabel(p, lang, s)}</p>
        <div className="row">
          {p.price !== null ? (
            <AddToCart slug={p.slug} stock={p.stock} cartHref={href(lang, '/cart')} t={s} />
          ) : (
            <a className="btn btn--acid btn--lg" href={mailto(name, `${s.ask}: ${name}`)}>
              {s.ask} →
            </a>
          )}
          {piece3d && (
            <Cta plain href={href(lang, `/art/customize?p=${piece3d.id}`)}>
              {cfgDict[lang].view3d}
            </Cta>
          )}
        </div>
        <p className="fine">{s.handmade}</p>
        {details.length > 0 && (
          <dl className="facts">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {p.work && (
          <Link className="link" href={href(lang, `/art/${p.work}`)}>
            {s.story} →
          </Link>
        )}
        <div className="custom">
          <p>{s.variant}</p>
          <div className="row">
            <Cta plain href={commissionHref(lang, 'custom', p.slug)}>
              {s.customCta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductPage
