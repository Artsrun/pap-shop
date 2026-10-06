import Link from 'next/link'
import { CartView, type CartItem } from '@/components/cart'
import { products } from '@/lib/content'
import { href, tr } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return { ...pageMeta(lang, '/cart', t.cart.title), robots: { index: false } }
}

const Cart = async () => {
  const { lang, t } = await getT()
  const items: CartItem[] = products.flatMap((p) =>
    p.price === null
      ? []
      : [{ slug: p.slug, title: tr(p.title, lang), price: p.price, stock: p.stock, photo: p.photos[0], href: href(lang, `/shop/p/${p.slug}`) }],
  )
  return (
    <section className="sec wrap narrow">
      <h1>{t.cart.title}</h1>
      <CartView items={items} lang={lang} t={t.cart} />
      <p className="more">
        <Link href={href(lang, '/shop')}>← {t.cart.back}</Link>
      </p>
    </section>
  )
}

export default Cart
