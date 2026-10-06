import Link from 'next/link'
import { Guide, KeepExploring, Live, RestosList, studio } from '@/components/blocks'
import { Band, Cells, Cta, Fig, pad, Pic } from '@/components/ui'
import { commissionHref } from '@/lib/content'
import { href } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/restaurants', t.nav.restaurants, t.restaurants.text)
}

const Restaurants = async () => {
  const { lang, t } = await getT()
  const r = t.restaurants
  // every "what we make / what you can choose" line opens the form with that line filled in
  const order = (item: string) => commissionHref(lang, 'restaurant', item)
  return (
    <>
      <section className="xhero">
        <Pic src="v3-world-restaurants" sizes="100vw" eager />
        <div className="xhero__shade" />
        <div className="xhero__crumbs label">
          <Link href={href(lang, '/')}>← {t.ui.back}</Link>
          <span>01 / 04</span>
        </div>
        <div className="xhero__content">
          <span className="label">01 — {t.nav.restaurants}</span>
          <h1 className="display xhero__h1--long">{r.title}</h1>
          <div className="row">
            <Cta href={order('')}>{r.cta}</Cta>
            <Cta plain className="xhero__ghost" href={href(lang, '/contact')}>
              {r.cta2}
            </Cta>
          </div>
        </div>
      </section>

      <section className="twocol">
        <h2 className="display rv">{t.nav.restaurants}</h2>
        <div className="rv">
          <p className="lead">{r.text}</p>
          <p className="muted">{r.service}</p>
        </div>
      </section>

      <div className="shead">
        <div>
          <h2 className="display rv">{r.makeTitle}</h2>
          <p className="car__sub">{r.makeSub}</p>
        </div>
      </div>
      <section className="menu">
        <Fig className="menu__img" src="v3-menu" sizes="(max-width: 1000px) 100vw, 40vw" />
        <ul className="menu__list">
          {r.make.map((item, i) => (
            <li key={item} className="rv">
              <Link href={order(item)}>
                <span className="mi-num">{pad(i + 1)}</span>
                <span className="mi-name display">{item}</span>
                <span className="mi-arrow" aria-hidden="true">
                  {r.order} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="hls">
        <div className="hls__title label">{r.customTitle}</div>
        <div className="hls__row">
          {r.custom.map((item, i) => (
            <Link key={item} className="hl rv" href={order(item)}>
              <span className="label">{pad(i + 1)}</span>
              <b className="display">{item}</b>
            </Link>
          ))}
        </div>
      </section>

      <div className="shead">
        <div>
          <h2 className="display rv">{r.oursTitle}</h2>
          <p className="car__sub">{r.oursSub}</p>
        </div>
        <Link className="link" href={order('')}>
          {r.order} →
        </Link>
      </div>
      <RestosList />

      <Band title={r.stepsTitle} count={r.steps.length} />
      <Cells steps items={r.steps} />

      <Live photos={studio} />

      <Guide label={r.forYou} title={t.band.title} text={t.band.text}>
        <Cta href={order('')}>{r.cta}</Cta>
        <Cta plain href={href(lang, '/contact')}>
          {r.cta2}
        </Cta>
        <Cta plain href={commissionHref(lang)}>
          {t.form.title}
        </Cta>
      </Guide>

      <KeepExploring from="restaurants" />
    </>
  )
}

export default Restaurants
