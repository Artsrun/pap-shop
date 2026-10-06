import { CommissionCta, PHero, RestosList } from '@/components/blocks'
import { Band, Cells, Cta, Feature, Strip } from '@/components/ui'
import { commissionHref, projects } from '@/lib/content'
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
  const hasProjects = projects.some((p) => p.kind === 'tiles')
  return (
    <>
      <PHero label={`02 — ${t.nav.tiles}`} title={s.title} text={s.text} photo="v3-tiles">
        <Cta href={commissionHref(lang, 'tiles')}>{s.cta}</Cta>
        <Cta plain href={href(lang, '/contact')}>
          {s.cta2}
        </Cta>
      </PHero>
      <Band title={s.forTitle} count={s.for.length} />
      <Cells items={s.for} />
      <Band title={s.customTitle} count={s.custom.length} />
      <Cells items={s.custom} />
      {hasProjects ? (
        <>
          <Band title={s.projectsTitle} />
          <RestosList kind="tiles" />
        </>
      ) : (
        <Feature photo="v3-studio-bowl" title={s.projectsTitle} text={s.projectsEmpty}>
          <Cta plain href={href(lang, '/contact')}>
            {t.nav.contact}
          </Cta>
        </Feature>
      )}
      <Band title={s.stepsTitle} count={s.steps.length} />
      <Cells steps items={s.steps} />
      <div className="after">
        <Cta href={commissionHref(lang, 'tiles')}>{s.cta}</Cta>
      </div>
      <Strip
        photos={[
          ['v3-tiles-1', ''],
          ['v3-tiles-2', ''],
          ['v3-tiles-3', ''],
        ]}
      />
      <CommissionCta />
    </>
  )
}

export default Tiles
