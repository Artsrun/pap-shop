import { ArtGrid, CommissionCta, PHero } from '@/components/blocks'
import { Cta, Feature } from '@/components/ui'
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
  const a = t.art
  return (
    <>
      <PHero label={`03 — ${t.nav.art}`} title={a.title} text={a.text} photo="v3-art">
        <Cta href={commissionHref(lang, 'art')}>{a.cta}</Cta>
      </PHero>
      <ArtGrid />
      <Feature photo="v3-art-feature" title={a.commissionTitle} text={a.commissionText}>
        <Cta href={commissionHref(lang, 'art')}>{a.cta}</Cta>
        <Cta plain href={href(lang, '/art/customize')}>
          {a.startFrom}
        </Cta>
      </Feature>
      <CommissionCta />
    </>
  )
}

export default Art
