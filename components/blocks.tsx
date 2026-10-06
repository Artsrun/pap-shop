import Link from 'next/link'
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
import { href, tr, type L } from '@/lib/i18n'
import { getT } from '@/lib/t'
import { Chips, Cta, Photo, ProductCard, Section, WorkCard } from './ui'

// Server blocks that read the locale themselves.

export const Band = async () => {
  const { lang, t } = await getT()
  return (
    <section className="band">
      <div className="wrap">
        <h2>{t.band.title}</h2>
        <p>{t.band.text}</p>
        <div className="actions">
          <Cta href={commissionHref(lang, 'restaurant')}>{t.band.restaurant}</Cta>
          <Cta href={commissionHref(lang, 'art')}>{t.band.art}</Cta>
          <Cta href={commissionHref(lang, 'tiles')}>{t.band.tiles}</Cta>
        </div>
      </div>
    </section>
  )
}

export const ProjectGrid = async ({ kind, title, empty }: { kind: Project['kind']; title: string; empty: string }) => {
  const { lang } = await getT()
  const list = projects.filter((p) => p.kind === kind)
  return (
    <Section title={title}>
      {list.length ? (
        <div className="grid">
          {list.map((p) => (
            <Link key={p.slug} className="card" href={projectHref(lang, p)}>
              <Photo src={p.cover} sizes="(max-width: 600px) 100vw, 33vw" />
              <span>{p.name}</span>
              <small>
                {p.city} · {p.year}
              </small>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty">{empty}</p>
      )}
    </Section>
  )
}

/** Case study: restaurant (concept → collection → glazes → photos) or tiles (tile → pattern → glaze → interior). */
export const ProjectDetail = async ({ project: p }: { project: Project }) => {
  const { lang, t } = await getT()
  const parts: [string, L | undefined][] =
    p.kind === 'restaurant'
      ? [[t.project.concept, p.concept], [t.project.collection, p.collection], [t.project.materials, p.materials]]
      : [[t.project.tile, p.tile], [t.project.pattern, p.pattern], [t.project.materials, p.materials], [t.project.concept, p.concept]]

  return (
    <>
      <section className="hero">
        <Photo src={p.cover} sizes="(max-width: 860px) 100vw, 50vw" eager className="hero-ph" />
        <div className="hero-txt">
          <p className="label">
            {p.city} · {p.year}
          </p>
          <h1>{p.name}</h1>
        </div>
      </section>
      <Section className="narrow">
        <dl className="facts">
          {parts.map(
            ([label, text]) =>
              text && (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{tr(text, lang)}</dd>
                </div>
              ),
          )}
        </dl>
      </Section>
      <Section>
        <div className="gallery">
          {p.gallery.map((src) => (
            <Photo key={src} src={src} sizes="(max-width: 860px) 100vw, 50vw" />
          ))}
        </div>
        <div className="actions">
          <Cta href={commissionHref(lang, p.kind)}>{t.project.start}</Cta>
        </div>
      </Section>
    </>
  )
}

export const ArtGrid = async ({ category }: { category?: ArtCategory }) => {
  const { lang, t } = await getT()
  const list = category ? works.filter((w) => w.categories.includes(category)) : works
  const chips = artCategories.filter((c) => c === category || filledArtCategories.includes(c))
  return (
    <Section>
      <Chips
        label={t.nav.art}
        items={[
          { href: href(lang, '/art'), label: t.art.all, current: !category },
          ...chips.map((c) => ({ href: href(lang, `/art/c/${c}`), label: t.art.cats[c], current: c === category })),
        ]}
      />
      {list.length ? (
        <div className="grid editorial">
          {list.map((w) => (
            <WorkCard key={w.slug} work={w} lang={lang} />
          ))}
        </div>
      ) : (
        <p className="empty">{t.art.empty}</p>
      )}
    </Section>
  )
}

export const ShopGrid = async ({ category }: { category?: Category }) => {
  const { lang, t } = await getT()
  const list = category ? products.filter((p) => inCategory(p, category)) : products
  const chips = categories.filter((c) => c === category || filledCategories.includes(c))
  return (
    <>
      <section className="sec wrap page-head">
        <h1>{category ? t.shop.cats[category] : t.shop.title}</h1>
        <p className="lead">{t.shop.text}</p>
        <Chips
          label={t.nav.shop}
          items={[
            { href: href(lang, '/shop'), label: t.shop.all, current: !category },
            ...chips.map((c) => ({ href: href(lang, `/shop/${c}`), label: t.shop.cats[c], current: c === category })),
          ]}
        />
      </section>
      <Section>
        {list.length ? (
          <div className="grid">
            {list.map((p) => (
              <ProductCard key={p.slug} p={p} lang={lang} t={t.shop} />
            ))}
          </div>
        ) : (
          <p className="empty">{t.shop.empty}</p>
        )}
      </Section>
      <Section className="custom">
        <h2>{t.shop.customTitle}</h2>
        <p>{t.shop.customText}</p>
        <Cta href={commissionHref(lang, 'custom')}>{t.shop.customCta}</Cta>
      </Section>
    </>
  )
}
