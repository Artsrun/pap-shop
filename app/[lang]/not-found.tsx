import { Cta } from '@/components/ui'
import { href } from '@/lib/i18n'
import { getT } from '@/lib/t'

const NotFound = async () => {
  const { lang, t } = await getT()
  return (
    <section className="sec wrap narrow">
      <h1>{t.notFound.title}</h1>
      <div className="actions">
        <Cta href={href(lang, '/')}>{t.notFound.back}</Cta>
      </div>
    </section>
  )
}

export default NotFound
