import Link from 'next/link'
import { Band } from '@/components/blocks'
import { Hero, Photo, Section, WorkCard } from '@/components/ui'
import { works } from '@/lib/content'
import { href } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang } = await getT()
  return pageMeta(lang, '/')
}

const Home = async () => {
  const { lang, t } = await getT()
  const worlds = [
    { path: '/restaurants', name: t.nav.restaurants, text: t.home.restaurants, photo: 'work-05', cta: t.home.explore },
    { path: '/art', name: t.nav.art, text: t.home.art, photo: 'work-01', cta: t.home.explore },
    { path: '/tiles', name: t.nav.tiles, text: t.home.tiles, photo: 'detail-3', cta: t.home.explore },
    { path: '/shop', name: t.nav.shop, text: t.home.shop, photo: 'work-02', cta: t.home.shopNow },
  ]

  return (
    <>
      <Hero title={t.home.title} text={t.home.text} photo="hero" alt={t.home.alt} />

      <section className="worlds wrap">
        {worlds.map((w) => (
          <Link key={w.path} href={href(lang, w.path)} className={`world${w.path === '/shop' ? ' is-shop' : ''}`}>
            <Photo src={w.photo} sizes="(max-width: 860px) 100vw, 50vw" />
            <span className="world-txt">
              <b>{w.name}</b>
              <span>{w.text}</span>
              <em>{w.cta} →</em>
            </span>
          </Link>
        ))}
      </section>

      <Section title={t.home.selected}>
        <div className="grid">
          {works.slice(0, 4).map((w) => (
            <WorkCard key={w.slug} work={w} lang={lang} />
          ))}
        </div>
        <p className="more">
          <Link href={href(lang, '/art')}>{t.home.all} →</Link>
        </p>
      </Section>

      <Band />
    </>
  )
}

export default Home
