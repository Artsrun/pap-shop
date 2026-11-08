import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  artCategories,
  categories,
  commissionHref,
  filledArtCategories,
  filledCategories,
  inCategory,
  products,
  projectHref,
  projects,
  works,
  type ArtCategory,
  type Category,
  type Project,
} from '@/lib/content'
import { href, tr } from '@/lib/i18n'
import { links, site } from '@/lib/site'
import { getT } from '@/lib/t'
import { CarButtons } from './fx'
import { Band, Cells, Chips, Cta, Feature, Fig, Pic, pad, priceLabel, WorkTile } from './ui'

// Server blocks in Lusine's markup. They read the locale themselves.

type PHeroProps = { label: string; title: string; text?: string; photo?: string; alt?: string; small?: boolean; children?: ReactNode }

/** Page head: label + back link, big title, text, buttons, photo on the right. */
export const PHero = async ({ label, title, text, photo, alt, small, children }: PHeroProps) => {
  const { lang, t } = await getT()
  const body = (
    <div>
      <h1 className="display rv">{title}</h1>
      {text && <p className="lead rv">{text}</p>}
      {children && <div className="row rv">{children}</div>}
    </div>
  )
  return (
    <section className={small ? 'phero phero--sm' : 'phero'}>
      <div className="phero__meta">
        <span className="label">{label}</span>
        <Link className="label" href={href(lang, '/')}>
          ← {t.ui.back}
        </Link>
      </div>
      {photo ? (
        <div className="phero__grid">
          {body}
          <Fig className="phero__img rv" src={photo} alt={alt} sizes="(max-width: 1000px) 100vw, 45vw" eager />
        </div>
      ) : (
        body
      )}
    </section>
  )
}

/** "Have a project in mind?" with the three commission entry points. */
export const CommissionCta = async () => {
  const { lang, t } = await getT()
  return (
    <section className="cta">
      <Fig className="cta__img rv" src="v3-cta" alt={t.about.alt} sizes="(max-width: 680px) 100vw, 40vw" />
      <div className="cta__body rv">
        <h2 className="display">{t.band.title}</h2>
        <p>{t.band.text}</p>
        <div className="row">
          <Cta href={commissionHref(lang, 'restaurant')}>{t.band.restaurant}</Cta>
          <Cta plain href={commissionHref(lang, 'art')}>
            {t.band.art}
          </Cta>
          <Cta plain href={commissionHref(lang, 'tiles')}>
            {t.band.tiles}
          </Cta>
        </div>
      </div>
    </section>
  )
}

/** Restaurant index: logo, name, city; three works slide in on hover. */
export const RestosList = async ({ kind = 'restaurant' }: { kind?: Project['kind'] }) => {
  const { lang, t } = await getT()
  return (
    <section className="restos" aria-label={t.restaurants.oursSub}>
      <ul className="menu__list">
        {projects
          .filter((p) => p.kind === kind)
          .map((p, i) => (
            <li key={p.slug} className="rv">
              <Link href={projectHref(lang, p)}>
                <span className="mi-num">{pad(i + 1)}</span>
                <span className="ri-logo">{p.logo && <Image src={`/img/${p.logo}.jpg`} alt="" width={64} height={64} />}</span>
                <span className="ri-text">
                  <span className="mi-name display">{p.name}</span>
                  <span className="label">
                    {tr(p.label, lang)}
                    {p.closed && ` · ${t.project.closed}`}
                  </span>
                </span>
                <span className="ri-preview" aria-hidden="true">
                  {p.pieces.slice(0, 3).map((x) => (
                    <Image key={x.photo} src={`/img/${x.photo}.jpg`} alt="" width={88} height={110} />
                  ))}
                </span>
                <span className="mi-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}

/** "From the studio" + Instagram link + three photos. */
export const Live = async ({ photos }: { photos: [src: string, alt: string][] }) => {
  const { t } = await getT()
  return (
    <section className="live">
      <div className="live__head">
        <h2 className="display rv">{t.home.studio}</h2>
        <a className="link" href={links.instagram} target="_blank" rel="noopener noreferrer">
          @{site.instagram} ↗
        </a>
      </div>
      <div className="strip">
        {photos.map(([src, alt]) => (
          <Fig key={src} className="rv" src={src} alt={alt} sizes="33vw" />
        ))}
      </div>
    </section>
  )
}

/** Grey closing block: label, title, text, stacked buttons. */
export const Guide = ({ label, title, text, children }: { label: string; title: string; text: string; children: ReactNode }) => (
  <section className="guide">
    <div className="rv">
      <span className="label">{label}</span>
      <h2 className="display">{title}</h2>
      <p>{text}</p>
    </div>
    <div className="row rv">{children}</div>
  </section>
)

type CarCard = { href: string; photo: string; title: string; label?: string; text?: string; link?: string; badge?: string }

/** Horizontal carousel: swipe on phones, ← → on desktop. */
export const Carousel = async ({ title, sub, wide, cards, link }: { title: string; sub: string; wide?: boolean; cards: CarCard[]; link?: { href: string; label: string } }) => {
  const { t } = await getT()
  return (
    <section className="car" data-carousel>
      <div className="car__head">
        <div>
          <h2 className="display">{title}</h2>
          <p className="car__sub">{sub}</p>
        </div>
        <div className="car__nav">
          {link && (
            <Link className="link" href={link.href}>
              {link.label} →
            </Link>
          )}
          <CarButtons prev={t.ui.prev} next={t.ui.next} />
        </div>
      </div>
      <div className="car__track">
        {cards.map((c) => (
          <Link key={c.href + c.photo} className={wide ? 'car__card car__card--wide rv' : 'car__card rv'} href={c.href}>
            <div className="car__img">
              {c.badge && <span className="mm-badge">{c.badge}</span>}
              <Pic src={c.photo} alt={c.text ? c.title : ''} sizes="(max-width: 680px) 80vw, 33vw" />
            </div>
            <figcaption>
              {c.label && <span className="label">{c.label}</span>}
              <b>{c.title}</b>
              {c.text && <span>{c.text}</span>}
              {c.link && <span className="link">{c.link} →</span>}
            </figcaption>
          </Link>
        ))}
      </div>
    </section>
  )
}

const worldList = ['restaurants', 'tiles', 'art', 'shop'] as const
export type World = (typeof worldList)[number]

/** "Keep exploring…": the other three worlds. */
export const KeepExploring = async ({ from }: { from: World }) => {
  const { lang, t } = await getT()
  return (
    <Carousel
      wide
      title={t.restaurants.keepTitle}
      sub={t.restaurants.keepSub}
      cards={worldList
        .map((w, i) => ({ w, n: pad(i + 1) }))
        .filter(({ w }) => w !== from)
        .map(({ w, n }) => ({ href: href(lang, `/${w}`), photo: `v3-world-${w}`, title: t.nav[w], label: n }))}
    />
  )
}

/** Restaurant case study (Lusine's restaurant-*.html). */
export const ProjectDetail = async ({ project: p }: { project: Project }) => {
  const { lang, t } = await getT()
  const r = t.restaurants
  const list = projects.filter((x) => x.kind === p.kind)
  const index = list.indexOf(p) + 1
  const back = p.kind === 'restaurant' ? { path: '/restaurants', label: t.nav.restaurants } : { path: '/tiles', label: t.nav.tiles }
  const type = p.kind === 'restaurant' ? 'restaurant' : 'tiles'
  return (
    <>
      <section className="xhero">
        <Pic src={p.cover} alt="" sizes="100vw" eager />
        <div className="xhero__shade" />
        <div className="xhero__crumbs label">
          <Link href={href(lang, back.path)}>← {back.label}</Link>
          <span>
            {pad(index)} / {pad(list.length)}
          </span>
        </div>
        <div className="xhero__content">
          {p.logo && (
            <div className="r-logo">
              <Pic src={p.logo} alt={`${p.name} logo`} sizes="120px" />
            </div>
          )}
          <span className="label">
            {t.project.partner} · {tr(p.label, lang)}
            {p.closed && ` · ${t.project.closed}`}
          </span>
          <h1 className="display">{p.name}</h1>
          <div className="row">
            <Cta href="#works">{t.project.viewWorks}</Cta>
            {p.instagram && (
              <Cta plain className="xhero__ghost" href={`https://www.instagram.com/${p.instagram}/`}>
                @{p.instagram}
              </Cta>
            )}
          </div>
        </div>
      </section>
      <section className="twocol">
        <h2 className="display rv">
          {p.name} {t.project.and} Ruben Pap
        </h2>
        <div className="rv">
          <p className="lead">{tr(p.concept, lang)}</p>
          <p className="muted">{t.project.served}</p>
        </div>
      </section>
      {p.facts.length > 0 && (
        <section className="hls">
          <div className="hls__title label">{t.project.glance}</div>
          <div className="hls__row">
            {p.facts.map((f) => (
              <div key={f.label.en} className="hl rv">
                <span className="label">{tr(f.label, lang)}</span>
                <b className="display">{tr(f.value, lang)}</b>
              </div>
            ))}
          </div>
        </section>
      )}
      <div id="works" />
      <Carousel
        title={t.project.worksTitle}
        sub={t.project.worksSub.replace('{n}', pad(p.pieces.length))}
        cards={p.pieces.map((x) => {
          const work = works.find((w) => w.slug === x.work)
          return {
            href: commissionHref(lang, type, x.work),
            photo: x.photo,
            title: work ? tr(work.title, lang) : p.name,
            text: t.project.cardText,
            link: t.project.orderSimilar,
          }
        })}
      />
      <Band title={t.project.howWorked} count={r.steps.length} />
      <Cells steps items={r.steps} />
      <Live photos={studio} />
      <Guide label={r.forYou} title={t.project.similarTitle} text={t.project.similarText}>
        <Cta href={commissionHref(lang, type)}>{r.cta}</Cta>
        <Cta plain href={href(lang, '/contact')}>
          {r.cta2}
        </Cta>
        <Cta plain href={href(lang, back.path)}>
          {t.project.all}
        </Cta>
      </Guide>
      {list.length > 1 && (
        <Carousel
          wide
          title={r.keepTitle}
          sub={t.project.others}
          link={{ href: href(lang, back.path), label: t.project.all }}
          cards={list
            .filter((x) => x !== p)
            .map((x) => ({
              href: projectHref(lang, x),
              photo: x.cover,
              title: x.name,
              label: tr(x.label, lang),
              badge: x.closed ? t.project.closed : undefined,
            }))}
        />
      )}
    </>
  )
}

/** Studio photos shared by the restaurant pages. */
export const studio: [string, string][] = [
  ['v3-studio-1', ''],
  ['v3-studio-2', ''],
  ['v3-studio-3', ''],
]

/** Art & Decor grid with category links ("All" + only the categories that have works). */
export const ArtGrid = async ({ category }: { category?: ArtCategory }) => {
  const { lang, t } = await getT()
  const list = category ? works.filter((w) => w.categories.includes(category)) : works
  const chips = artCategories.filter((c) => c === category || filledArtCategories.includes(c))
  return (
    <>
      <Band title={t.art.worksBand} count={list.length} />
      <Chips
        label={t.nav.art}
        items={[
          { href: href(lang, '/art'), label: t.art.all, current: !category },
          ...chips.map((c) => ({ href: href(lang, `/art/c/${c}`), label: t.art.cats[c], current: c === category })),
        ]}
      />
      {list.length ? (
        <section className="works works--3">
          {list.map((w) => (
            <WorkTile key={w.slug} href={href(lang, `/art/${w.slug}`)} photo={w.photos[0]} title={tr(w.title, lang)} />
          ))}
        </section>
      ) : (
        <p className="empty">{t.art.empty}</p>
      )}
    </>
  )
}

/** Shop grid with category links, price under every piece. */
export const ShopGrid = async ({ category }: { category?: Category }) => {
  const { lang, t } = await getT()
  const s = t.shop
  const list = category ? products.filter((p) => inCategory(p, category)) : products
  const chips = categories.filter((c) => c === category || filledCategories.includes(c))
  return (
    <>
      <Band title={t.art.worksBand} count={list.length} />
      <Chips
        label={t.nav.shop}
        items={[
          { href: href(lang, '/shop'), label: s.all, current: !category },
          ...chips.map((c) => ({ href: href(lang, `/shop/${c}`), label: s.cats[c], current: c === category })),
        ]}
      />
      {list.length ? (
        <section className="works works--3">
          {list.map((p) => (
            <WorkTile
              key={p.slug}
              href={href(lang, `/shop/p/${p.slug}`)}
              photo={p.photos[0]}
              title={tr(p.title, lang)}
              note={`${priceLabel(p, lang, s)}${p.kind === 'unique' ? ` · ${s.unique}` : ''}`}
            />
          ))}
        </section>
      ) : (
        <p className="empty">{s.empty}</p>
      )}
      <Feature photo="v3-shop-feature" title={s.customTitle} text={s.customText}>
        <Cta href={commissionHref(lang, 'custom')}>{s.customCta}</Cta>
      </Feature>
    </>
  )
}
