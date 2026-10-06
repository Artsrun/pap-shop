import Link from 'next/link'
import { CommissionCta, RestosList } from '@/components/blocks'
import { Band, Fig, pad, Pic, Strip, WorkTile } from '@/components/ui'
import { commissionHref, projects, works } from '@/lib/content'
import { href, tr } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang } = await getT()
  return pageMeta(lang, '/')
}

const Home = async () => {
  const { lang, t } = await getT()
  const h = t.home
  const worlds = [
    { path: '/restaurants', text: h.restaurants, cta: h.explore, name: t.nav.restaurants, photo: 'v3-world-restaurants' },
    { path: '/tiles', text: h.tiles, cta: h.explore, name: t.nav.tiles, photo: 'v3-world-tiles' },
    { path: '/art', text: h.art, cta: h.explore, name: t.nav.art, photo: 'v3-world-art' },
    { path: '/shop', text: h.shop, cta: h.shopNow, name: t.nav.shop, photo: 'v3-world-shop' },
  ]
  const selected = works.slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="hero__meta">
          <span className="label">{h.meta1}</span>
          <span className="label">{h.meta2}</span>
        </div>
        <div className="hero__grid">
          <h1 className="display rv">
            <span className="thin">{h.titleThin}</span> {h.titleBold}
          </h1>
          <figure className="hero__img rv" data-fig={`FIG. 01 — ${tr(works[1].title, lang)}`}>
            <Pic src="v3-hero" alt={h.alt} sizes="(max-width: 1000px) 100vw, 45vw" eager />
          </figure>
        </div>
        <p className="rv">{h.text}</p>
      </section>

      <Band title={h.worldsTitle} link={{ href: commissionHref(lang), label: h.commissionLink }} />
      <section className="worlds">
        {worlds.map((w, i) => (
          <Link key={w.path} className="world rv" href={href(lang, w.path)}>
            <span className="num">{pad(i + 1)}</span>
            <h3>{w.name}</h3>
            <p>{w.text}</p>
            <Fig src={w.photo} sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 25vw" />
            <span className="link">{w.cta} →</span>
          </Link>
        ))}
      </section>

      <Band title={h.worksTitle} count={selected.length} link={{ href: href(lang, '/art'), label: h.all }} />
      <section className="works">
        {selected.map((w) => (
          <WorkTile key={w.slug} href={href(lang, `/art/${w.slug}`)} photo={w.photos[0]} title={tr(w.title, lang)} />
        ))}
      </section>

      <Band
        title={h.partners}
        count={projects.filter((p) => p.kind === 'restaurant').length}
        link={{ href: href(lang, '/restaurants'), label: t.nav.restaurants }}
      />
      <RestosList />

      <CommissionCta />

      <Strip
        label={h.studio}
        photos={[
          ['v3-studio-torch', ''],
          ['v3-studio-bowl', ''],
          ['v3-studio-hands', ''],
        ]}
      />
    </>
  )
}

export default Home
