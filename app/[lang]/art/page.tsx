import { Band } from '@/components/blocks'
import { Cta, Hero, Section, WorkCard } from '@/components/ui'
import { commissionHref, works } from '@/lib/content'
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
      <Section>
        <div className="grid editorial">
          {works.map((w) => (
            <WorkCard key={w.slug} work={w} lang={lang} />
          ))}
        </div>
      </Section>
      <Section title={t.art.commissionTitle} className="custom">
        <p>{t.art.commissionText}</p>
        <Cta href={commissionHref(lang, 'art')}>{t.art.cta}</Cta>
      </Section>
      <Band />
    </>
  )
}

export default Art
