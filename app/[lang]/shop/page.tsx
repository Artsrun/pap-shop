import { PHero, ShopGrid } from '@/components/blocks'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/shop', t.nav.shop, t.shop.text)
}

const Shop = async () => {
  const { t } = await getT()
  return (
    <>
      <PHero label={`04 — ${t.nav.shop}`} title={t.shop.title} text={t.shop.text} photo="v3-shop" />
      <ShopGrid />
    </>
  )
}

export default Shop
