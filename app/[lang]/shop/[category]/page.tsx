import { notFound } from 'next/navigation'
import { PHero, ShopGrid } from '@/components/blocks'
import { categories, isCategory } from '@/lib/content'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const dynamicParams = false
export const generateStaticParams = () => categories.map((category) => ({ category }))

export const generateMetadata = async ({ params }: PageProps<'/[lang]/shop/[category]'>) => {
  const { lang, t } = await getT()
  const { category } = await params
  return pageMeta(lang, `/shop/${category}`, isCategory(category) ? t.shop.cats[category] : undefined)
}

const ShopCategory = async ({ params }: PageProps<'/[lang]/shop/[category]'>) => {
  const { t } = await getT()
  const { category } = await params
  if (!isCategory(category)) notFound()
  return (
    <>
      <PHero small label={`04 — ${t.nav.shop}`} title={t.shop.cats[category]} text={t.shop.text} />
      <ShopGrid category={category} />
    </>
  )
}

export default ShopCategory
