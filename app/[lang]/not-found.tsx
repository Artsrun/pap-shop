import { PHero } from '@/components/blocks'
import { Cta } from '@/components/ui'
import { href } from '@/lib/i18n'
import { getT } from '@/lib/t'

const NotFound = async () => {
  const { lang, t } = await getT()
  return (
    <PHero small label="404" title={t.notFound.title}>
      <Cta href={href(lang, '/')}>{t.notFound.back}</Cta>
    </PHero>
  )
}

export default NotFound
