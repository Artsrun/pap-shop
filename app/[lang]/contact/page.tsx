import { PHero } from '@/components/blocks'
import { Cta } from '@/components/ui'
import { commissionHref } from '@/lib/content'
import { pageMeta } from '@/lib/meta'
import { links, site } from '@/lib/site'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/contact', t.nav.contact, t.contact.visits)
}

const Contact = async () => {
  const { lang, t } = await getT()
  const c = t.contact
  const follow = [
    ['Instagram', links.instagram],
    ['Facebook', links.facebook],
    ['Telegram', links.telegram],
    ['WhatsApp', links.whatsapp],
  ].filter(([, url]) => url)
  const out = { target: '_blank', rel: 'noopener noreferrer' }

  return (
    <>
      <PHero label={t.nav.contact} title={c.title} text={c.visits} photo="v3-contact">
        <Cta href={commissionHref(lang)}>{t.form.title}</Cta>
      </PHero>
      <section className="cells contact-grid">
        <dl className="cell rv">
          <dt className="label">{c.email}</dt>
          <dd>
            <a href={links.email}>{site.email}</a>
          </dd>
        </dl>
        <dl className="cell rv">
          <dt className="label">{c.phone}</dt>
          <dd>
            <a href={links.phone}>{site.phone}</a>
          </dd>
        </dl>
        <dl className="cell rv">
          <dt className="label">{c.studio}</dt>
          <dd>
            {c.address}
            <br />
            <span style={{ color: 'var(--muted)' }}>{c.visits}</span>
            <br />
            {c.map}:{' '}
            <a href={links.googleMaps} {...out}>
              Google ↗
            </a>{' '}
            ·{' '}
            <a href={links.yandexMaps} {...out}>
              Yandex ↗
            </a>
          </dd>
        </dl>
        <dl className="cell rv">
          <dt className="label">{c.follow}</dt>
          <dd>
            {follow.map(([name, url]) => (
              <span key={name}>
                <a href={url} {...out}>
                  {name} ↗
                </a>
                <br />
              </span>
            ))}
          </dd>
        </dl>
      </section>
      <div className="after">
        <Cta href={commissionHref(lang)}>{t.form.title}</Cta>
      </div>
    </>
  )
}

export default Contact
