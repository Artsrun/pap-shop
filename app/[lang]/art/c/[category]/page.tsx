import { notFound } from 'next/navigation'
import { ArtGrid } from '@/components/blocks'
import { Cta, Section } from '@/components/ui'
import { artCategories, commissionHref, isArtCategory } from '@/lib/content'
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
  return (
    <>
      <section className="sec wrap page-head">
        <p className="label">{t.nav.art}</p>
        <h1>{t.art.cats[category]}</h1>
      </section>
      <ArtGrid category={category} />
      <Section title={t.art.commissionTitle} className="custom">
        <p>{t.art.commissionText}</p>
        <Cta href={commissionHref(lang, 'art')}>{t.art.cta}</Cta>
      </Section>
    </>
  )
}

export default ArtCategoryPage
