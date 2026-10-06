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

  return (
    <section className="sec wrap narrow">
      <h1>{c.title}</h1>
      <dl className="facts">
        <div>
          <dt>{c.email}</dt>
          <dd>
            <a href={links.email}>{site.email}</a>
          </dd>
        </div>
        <div>
          <dt>{c.phone}</dt>
          <dd>
            <a href={links.phone}>{site.phone}</a>
          </dd>
        </div>
        <div>
          <dt>{c.studio}</dt>
          <dd>
            {c.address}
            <br />
            {c.visits}
            <br />
            {c.map}:{' '}
            <a href={links.googleMaps} target="_blank" rel="noopener noreferrer">
              Google
            </a>{' '}
            ·{' '}
            <a href={links.yandexMaps} target="_blank" rel="noopener noreferrer">
              Yandex
            </a>
          </dd>
        </div>
        <div>
          <dt>{c.follow}</dt>
          <dd className="social">
            {follow.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            ))}
          </dd>
        </div>
      </dl>
      <div className="actions">
        <Cta href={commissionHref(lang)}>{t.form.title}</Cta>
      </div>
    </section>
  )
}

export default Contact
