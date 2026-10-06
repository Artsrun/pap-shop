import { ArtGrid, Band } from '@/components/blocks'
import { Cta, Hero, Section } from '@/components/ui'
import { commissionHref } from '@/lib/content'
import { href } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/art', t.nav.art, t.art.text)
}

const Art = async () => {
  const { lang, t } = await getT()
  return (
    <>
      <Hero title={t.art.title} text={t.art.text} photo="work-04">
        <Cta href={commissionHref(lang, 'art')}>{t.art.cta}</Cta>
      </Hero>
      <ArtGrid />
      <Section title={t.art.commissionTitle} className="custom">
        <p>{t.art.commissionText}</p>
        <div className="actions">
          <Cta href={commissionHref(lang, 'art')}>{t.art.cta}</Cta>
          <Cta href={href(lang, '/art/customize')} kind="alt">
            {t.art.startFrom}
          </Cta>
        </div>
      </Section>
      <Band />
    </>
  )
}

export default Art
