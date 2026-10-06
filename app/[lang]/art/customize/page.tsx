import { Suspense } from 'react'
import { Configurator } from '@/components/configurator/configurator'
import { cfgDict } from '@/lib/cfg-dict'
import { works } from '@/lib/content'
import { tr } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { pieces } from '@/lib/pieces'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang } = await getT()
  return pageMeta(lang, '/art/customize', cfgDict[lang].title, cfgDict[lang].text)
}

/** 3D configurator. Shared designs: ?p=02&s=l&g=turquoise&f=60&t=30&l=80 */
const Customize = async () => {
  const { lang, t } = await getT()
  const c = cfgDict[lang]
  const names = Object.fromEntries(
    pieces.map((p) => {
      const work = works.find((w) => w.slug === p.work)
      return [p.id, work ? tr(work.title, lang) : p.id]
    }),
  )
  return (
    <section className="sec wrap">
      <p className="label">{t.nav.art}</p>
      <h1>{c.title}</h1>
      <p className="lead">{c.text}</p>
      <Suspense fallback={<p className="empty">{c.loading}</p>}>
        <Configurator lang={lang} t={c} names={names} />
      </Suspense>
    </section>
  )
}

export default Customize
