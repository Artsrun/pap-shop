import { Band } from '@/components/blocks'
import { Photo } from '@/components/ui'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/about', t.about.name, t.about.p1)
}

const About = async () => {
  const { t } = await getT()
  const a = t.about
  return (
    <>
      <section className="about sec wrap">
        <Photo src="about" alt={a.alt} sizes="(max-width: 860px) 100vw, 45vw" eager />
        <div>
          <p className="label">{a.label}</p>
          <h1>{a.name}</h1>
          <p>{a.p1}</p>
          <p>{a.p2}</p>
          <p>{a.p3}</p>
          <blockquote>{a.quote}</blockquote>
          <dl className="stats">
            <div>
              <dt>{a.f1}</dt>
              <dd>22</dd>
            </div>
            <div>
              <dt>{a.f2}</dt>
              <dd>2012</dd>
            </div>
          </dl>
        </div>
      </section>
      <Band />
    </>
  )
}

export default About
