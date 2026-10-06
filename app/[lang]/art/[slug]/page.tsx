import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Cta, Photo, Section, WorkCard } from '@/components/ui'
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
  const facts = [
    [t.art.collection, work.collection && tr(work.collection, lang)],
    [t.art.year, work.year],
    [t.art.material, work.material && tr(work.material, lang)],
    [t.art.dimensions, work.dimensions],
  ].filter(([, v]) => v)

  return (
    <>
      <section className="product wrap">
        <div className="gallery">
          {work.photos.map((src, i) => (
            <Photo key={src} src={src} alt={tr(work.title, lang)} sizes="(max-width: 860px) 100vw, 55vw" eager={i === 0} />
          ))}
        </div>
        <div className="buy">
          <p className="label">
            {work.categories.map((c, i) => (
              <span key={c}>
                {i > 0 && ' · '}
                <Link href={href(lang, `/art/c/${c}`)}>{t.art.cats[c]}</Link>
              </span>
            ))}
            {work.unique && ` · ${t.shop.unique}`}
          </p>
          <h1>{tr(work.title, lang)}</h1>
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
          <div className="actions">
            {forSale && (
              <Cta href={href(lang, `/shop/p/${forSale.slug}`)} kind="buy">
                {t.art.available}
              </Cta>
            )}
            {piece3d && (
              <Cta href={href(lang, `/art/customize?p=${piece3d.id}`)} kind="alt">
                {cfgDict[lang].view3d}
              </Cta>
            )}
            <Cta href={commissionHref(lang, 'art', work.slug)} kind={forSale ? 'alt' : 'ink'}>
              {t.art.similar}
            </Cta>
          </div>
        </div>
      </section>
      <Section title={t.art.more}>
        <div className="grid">
          {works
            .filter((w) => w.slug !== work.slug)
            .slice(0, 4)
            .map((w) => (
              <WorkCard key={w.slug} work={w} lang={lang} />
            ))}
        </div>
        <p className="more">
          <Link href={href(lang, '/art')}>{t.home.all} →</Link>
        </p>
      </Section>
    </>
  )
}

export default Artwork
