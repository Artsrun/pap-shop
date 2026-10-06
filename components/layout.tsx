import Link from 'next/link'
import { getT } from '@/lib/t'
import { href } from '@/lib/i18n'
import { links, site } from '@/lib/site'
import { CartLink } from './cart'
import { LangSwitch, Nav } from './nav'

export const Header = async () => {
  const { lang, t } = await getT()
  const items = [
    { path: '/restaurants', label: t.nav.restaurants },
    { path: '/art', label: t.nav.art },
    { path: '/tiles', label: t.nav.tiles },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
  ]
  return (
    <header className="site-header">
      <Link href={href(lang, '/')} className="logo">
        Ruben Pap<small>{t.brand.sub}</small>
      </Link>
      <Nav lang={lang} items={items} menu={t.ui.menu} />
      <div className="tools">
        <Link href={href(lang, '/shop')} className="shop-pill">
          {t.nav.shop}
        </Link>
        <CartLink href={href(lang, '/cart')} label={t.ui.cart} />
        <LangSwitch lang={lang} label={t.ui.language} />
      </div>
    </header>
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
    <footer className="site-footer">
      <div className="wrap">
        <p className="logo">Ruben Pap</p>
        <address>
          <a href={links.email}>{site.email}</a>
          <a href={links.phone}>{site.phone}</a>
          <span>{t.contact.address}</span>
          <span>{t.contact.visits}</span>
        </address>
        <p className="social">
          {social.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          ))}
        </p>
        <small>© {new Date().getFullYear()} {site.name}</small>
      </div>
    </footer>
  )
}
