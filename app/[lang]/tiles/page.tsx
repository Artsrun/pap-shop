import { Band, ProjectGrid } from '@/components/blocks'
import { Cta, Hero, Section, Steps, Tags } from '@/components/ui'
import { commissionHref } from '@/lib/content'
import { href } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/tiles', t.nav.tiles, t.tiles.text)
}

const Tiles = async () => {
  const { lang, t } = await getT()
  const s = t.tiles
  return (
    <>
      <Hero title={s.title} text={s.text} photo="detail-1">
        <Cta href={commissionHref(lang, 'tiles')}>{s.cta}</Cta>
        <Cta href={href(lang, '/contact')} kind="alt">
          {s.cta2}
        </Cta>
      </Hero>
      <Section title={s.forTitle}>
        <Tags items={s.for} />
      </Section>
      <Section title={s.customTitle}>
        <Tags items={s.custom} />
      </Section>
      <ProjectGrid kind="tiles" title={s.projectsTitle} empty={s.projectsEmpty} />
      <Section title={s.stepsTitle}>
        <Steps items={s.steps} />
        <div className="actions">
          <Cta href={commissionHref(lang, 'tiles')}>{s.cta}</Cta>
        </div>
      </Section>
      <Band />
    </>
  )
}

export default Tiles
