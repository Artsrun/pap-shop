import type { Metadata } from 'next'
import { preload } from 'react-dom'
import { Reveal } from '@/components/fx'
import { Footer, Header } from '@/components/layout'
import { locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'
import { getT } from '@/lib/t'
import '../fonts.css'
import '../lusine.css'
import '../v3.css'

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

// saved light/dark choice, applied before the first paint so it never flashes
const theme = `try{var s=localStorage.getItem('rp-theme');if(s)document.documentElement.dataset.theme=s}catch(e){}`

const font = { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' } as const

const RootLayout = async ({ children }: LayoutProps<'/[lang]'>) => {
  const { lang, t } = await getT()
  preload('/fonts/jetbrains-mono-latin.woff2', font)
  preload(lang === 'hy' ? '/fonts/noto-sans-armenian-armenian.woff2' : '/fonts/noto-sans-armenian-latin.woff2', font)
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body>
        <a className="skip" href="#main">
          {t.ui.skip}
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
      </body>
    </html>
  )
}

export default RootLayout
