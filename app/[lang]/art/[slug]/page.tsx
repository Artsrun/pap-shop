import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Band, Cta, Photo, WorkTile } from '@/components/ui'
import { commissionHref, products, works } from '@/lib/content'
import { href, tr } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { cfgDict } from '@/lib/cfg-dict'
import { pieceForWork } from '@/lib/pieces'
import { getT } from '@/lib/t'

export const dynamicParams = false
export const generateStaticParams = () => works.map(({ slug }) => ({ slug }))

const find = (slug: string) => works.find((w) => w.slug === slug)

export const generateMetadata = async ({ params }: PageProps<'/[lang]/art/[slug]'>) => {
  const { lang } = await getT()
  const { slug } = await params
  const work = find(slug)
  return pageMeta(lang, `/art/${slug}`, work && tr(work.title, lang))
}

const Artwork = async ({ params }: PageProps<'/[lang]/art/[slug]'>) => {
  const { lang, t } = await getT()
  const work = find((await params).slug)
  if (!work) notFound()

  const piece3d = pieceForWork(work.slug)
  const forSale = products.find((p) => p.slug === work.product && p.stock > 0)
  const more = works.filter((w) => w.slug !== work.slug).slice(0, 3)
  const facts = [
    [t.art.collection, work.collection && tr(work.collection, lang)],
    [t.art.year, work.year],
    [t.art.material, work.material && tr(work.material, lang)],
    [t.art.dimensions, work.dimensions],
  ].filter(([, v]) => v)

  return (
    <>
      <section className="product">
        <div className="gallery">
          {work.photos.map((src, i) => (
            <Photo key={src} src={src} alt={tr(work.title, lang)} sizes="(max-width: 860px) 100vw, 55vw" eager={i === 0} />
          ))}
        </div>
        <div className="buy">
          <p className="label">
            <Link href={href(lang, '/art')}>{t.nav.art}</Link>
            {work.categories.map((c) => (
              <span key={c}>
                {' · '}
                <Link href={href(lang, `/art/c/${c}`)}>{t.art.cats[c]}</Link>
              </span>
            ))}
            {work.unique && ` · ${t.shop.unique}`}
          </p>
          <h1 className="display">{tr(work.title, lang)}</h1>
          {facts.length > 0 && (
            <dl className="facts">
              {facts.map(([k, v]) => (
                <div key={String(k)}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {work.story && <p>{tr(work.story, lang)}</p>}
          <div className="row">
            <Cta plain={!!forSale} href={commissionHref(lang, 'art', work.slug)}>
              {t.art.similar}
            </Cta>
            {forSale && <Cta href={href(lang, `/shop/p/${forSale.slug}`)}>{t.art.available}</Cta>}
            {piece3d && (
              <Cta plain href={href(lang, `/art/customize?p=${piece3d.id}`)}>
                {cfgDict[lang].view3d}
              </Cta>
            )}
          </div>
        </div>
      </section>
      <Band title={t.art.more} count={more.length} link={{ href: href(lang, '/art'), label: t.home.all }} />
      <section className="works works--3">
        {more.map((w) => (
          <WorkTile key={w.slug} href={href(lang, `/art/${w.slug}`)} photo={w.photos[0]} title={tr(w.title, lang)} />
        ))}
      </section>
    </>
  )
}

export default Artwork
