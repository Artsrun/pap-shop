import { Band, ProjectGrid } from '@/components/blocks'
import { Cta, Hero, Section, Steps, Tags } from '@/components/ui'
import { commissionHref } from '@/lib/content'
import { href } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/restaurants', t.nav.restaurants, t.restaurants.text)
}

const Restaurants = async () => {
  const { lang, t } = await getT()
  const r = t.restaurants
  return (
    <>
      <Hero title={r.title} text={r.text} photo="work-05">
        <Cta href={commissionHref(lang, 'restaurant')}>{r.cta}</Cta>
        <Cta href={href(lang, '/contact')} kind="alt">
          {r.cta2}
        </Cta>
      </Hero>
      <Section title={r.makeTitle}>
        <Tags items={r.make} />
      </Section>
      <Section title={r.customTitle}>
        <Tags items={r.custom} />
        <h3>{r.serviceTitle}</h3>
        <p>{r.service}</p>
      </Section>
      <ProjectGrid kind="restaurant" title={r.projectsTitle} empty={r.projectsEmpty} />
      <Section title={r.stepsTitle}>
        <Steps items={r.steps} />
        <div className="actions">
          <Cta href={commissionHref(lang, 'restaurant')}>{r.cta}</Cta>
        </div>
      </Section>
      <Band />
    </>
  )
}

export default Restaurants
