import { notFound } from 'next/navigation'
import { ArtGrid, PHero } from '@/components/blocks'
import { Cta, Feature } from '@/components/ui'
import { artCategories, commissionHref, isArtCategory } from '@/lib/content'
import { href } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const dynamicParams = false
export const generateStaticParams = () => artCategories.map((category) => ({ category }))

export const generateMetadata = async ({ params }: PageProps<'/[lang]/art/c/[category]'>) => {
  const { lang, t } = await getT()
  const { category } = await params
  return pageMeta(lang, `/art/c/${category}`, isArtCategory(category) ? `${t.art.cats[category]} · ${t.nav.art}` : undefined)
}

const ArtCategoryPage = async ({ params }: PageProps<'/[lang]/art/c/[category]'>) => {
  const { lang, t } = await getT()
  const { category } = await params
  if (!isArtCategory(category)) notFound()
  const a = t.art
  return (
    <>
      <PHero small label={`03 — ${t.nav.art}`} title={a.cats[category]} />
      <ArtGrid category={category} />
      <Feature photo="v3-art-feature" title={a.commissionTitle} text={a.commissionText}>
        <Cta href={commissionHref(lang, 'art')}>{a.cta}</Cta>
        <Cta plain href={href(lang, '/art/customize')}>
          {a.startFrom}
        </Cta>
      </Feature>
    </>
  )
}

export default ArtCategoryPage
