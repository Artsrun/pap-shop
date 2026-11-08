import Link from 'next/link'
import { commissionHref, projectHref, projects } from '@/lib/content'
import { href, tr } from '@/lib/i18n'
import { links, site } from '@/lib/site'
import { getT } from '@/lib/t'
import { CartLink } from './cart'
import { ThemeToggle } from './fx'
import { SiteHeader } from './nav'
import { Cta, Pic } from './ui'

/** Restaurants dropdown: the partner restaurants + the two restaurant CTAs. */
const Mega = async () => {
  const { lang, t } = await getT()
  return (
    <div className="mega" role="region" aria-label={t.restaurants.oursTitle}>
      <div className="mega__inner">
        <div className="mega__head">
          <span className="label">{t.restaurants.oursTitle}</span>
          <div className="mega__ctas">
            <Cta small href={commissionHref(lang, 'restaurant')}>
              {t.restaurants.cta}
            </Cta>
            <Cta small plain href={href(lang, '/contact')}>
              {t.restaurants.cta2}
            </Cta>
            <Cta small plain href={href(lang, '/restaurants')}>
              {t.project.all}
            </Cta>
          </div>
        </div>
        <div className="mega__grid">
          {projects
            .filter((p) => p.kind === 'restaurant')
            .map((p) => (
              <Link key={p.slug} className="mm-card" href={projectHref(lang, p)}>
                <figure>
                  {p.closed && <span className="mm-badge">{t.project.closed}</span>}
                  <Pic src={p.cover} sizes="25vw" />
                </figure>
                <span className="mm-name">{p.name}</span>
                <span className="label">{tr(p.label, lang)}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

export const Header = async () => {
  const { lang, t } = await getT()
  return (
    <SiteHeader
      lang={lang}
      sub={t.brand.sub}
      labels={{ main: t.ui.main, menu: t.ui.menu, language: t.ui.language }}
      items={[
        { path: '/restaurants', label: t.nav.restaurants },
        { path: '/tiles', label: t.nav.tiles },
        { path: '/art', label: t.nav.art },
        { path: '/about', label: t.nav.about },
        { path: '/contact', label: t.nav.contact },
      ]}
      mega={<Mega />}
      tools={
        <>
          <ThemeToggle label={t.ui.theme} />
          <Link className="btn btn--acid" href={href(lang, '/shop')}>
            {t.nav.shop} →
          </Link>
          <CartLink href={href(lang, '/cart')} label={t.ui.cart} />
        </>
      }
    />
  )
}

export const Footer = async () => {
  const { t } = await getT()
  const social = [
    ['Instagram', links.instagram],
    ['Facebook', links.facebook],
    ['Telegram', links.telegram],
    ['WhatsApp', links.whatsapp],
  ].filter(([, url]) => url)

  return (
    <footer>
      <div className="foot">
        <div className="logo">
          <b>RUBEN PAP</b>
          <small className="label">{t.brand.sub}</small>
        </div>
        <div>
          <h4 className="label">{t.footer.contact}</h4>
          <ul>
            <li>
              <a href={links.email}>{site.email}</a>
            </li>
            <li>
              <a href={links.phone}>{site.phone}</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="label">{t.footer.studio}</h4>
          <ul>
            <li>{t.contact.address}</li>
            <li style={{ color: 'var(--muted)' }}>{t.contact.visits}</li>
          </ul>
        </div>
        <div>
          <h4 className="label">{t.footer.social}</h4>
          <ul>
            {social.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {name} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="copy">
        <small className="label">
          © {new Date().getFullYear()} {site.name}
        </small>
        <small className="label">{t.footer.tagline}</small>
      </div>
    </footer>
  )
}
