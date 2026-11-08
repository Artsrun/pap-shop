import { CommissionCta, PHero } from '@/components/blocks'
import { Fig, Strip } from '@/components/ui'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/about', t.about.name, t.about.p1)
}

const About = async () => {
  const { t } = await getT()
  const a = t.about
  // first clause of the quote in the thin weight, like Lusine's layout
  const cut = a.quote.indexOf(',') + 1
  return (
    <>
      <PHero label={a.label} title={a.name} photo="v3-about" alt={a.alt} />
      <section className="prose">
        <div className="rv">
          <p>{a.p1}</p>
          <p>{a.p2}</p>
          <p>{a.p3}</p>
        </div>
        <Fig className="rv" src="v3-studio-work" alt={a.alt} sizes="(max-width: 1000px) 100vw, 40vw" />
      </section>
      <section className="quote">
        <blockquote className="display rv">
          {cut > 0 && <span className="thin">{a.quote.slice(0, cut)}</span>} {a.quote.slice(cut)}
        </blockquote>
      </section>
      <section className="cells stats">
        <div className="cell rv">
          <b>22</b>
          <p>{a.f1}</p>
        </div>
        <div className="cell rv">
          <b>2012</b>
          <p>{a.f2}</p>
        </div>
      </section>
      <Strip
        photos={[
          ['v3-studio-torch', ''],
          ['v3-studio-ruben', a.alt],
          ['v3-studio-materials', ''],
        ]}
      />
      <CommissionCta />
    </>
  )
}

export default About
