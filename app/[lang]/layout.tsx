import type { Metadata } from 'next'
import { preload } from 'react-dom'
import { Footer, Header } from '@/components/layout'
import { locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'
import { getT } from '@/lib/t'
import '../fonts.css'
import '../globals.css'

export const generateStaticParams = () => locales.map((lang) => ({ lang }))

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getT()
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.title, template: `%s · ${t.meta.title}` },
    description: t.meta.description,
    icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
    openGraph: { siteName: t.meta.title, images: '/img/og-image.jpg' },
  }
}

const font = { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' } as const

const RootLayout = async ({ children }: LayoutProps<'/[lang]'>) => {
  const { lang, t } = await getT()
  preload('/fonts/inter-latin.woff2', font)
  preload('/fonts/cormorant-latin.woff2', font)
  return (
    <html lang={lang}>
      <body>
        <a className="skip" href="#main">
          {t.ui.skip}
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export default RootLayout
