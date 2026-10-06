import { CommissionForm } from '@/components/commission-form'
import { isProjectType, refTitle } from '@/lib/content'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/commission', t.form.title, t.form.text)
}

/** One form, four entry points: ?type=restaurant|art|tiles|custom&ref=<product or work slug> */
const Commission = async ({ searchParams }: PageProps<'/[lang]/commission'>) => {
  const { lang, t } = await getT()
  const { type, ref } = await searchParams
  return (
    <section className="sec wrap narrow">
      <h1>{t.form.title}</h1>
      <p className="lead">{t.form.text}</p>
      <CommissionForm
        t={t.form}
        type={isProjectType(type) ? type : undefined}
        reference={typeof ref === 'string' ? refTitle(ref, lang) : undefined}
      />
    </section>
  )
}

export default Commission
