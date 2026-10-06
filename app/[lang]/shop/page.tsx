import { ShopGrid } from '@/components/blocks'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/shop', t.nav.shop, t.shop.text)
}

const Shop = () => <ShopGrid />

export default Shop
