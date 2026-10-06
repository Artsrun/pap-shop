import { PHero } from '@/components/blocks'
import { CommissionForm } from '@/components/commission-form'
import { Pic } from '@/components/ui'
import { isProjectType, refTitle } from '@/lib/content'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const generateMetadata = async () => {
  const { lang, t } = await getT()
  return pageMeta(lang, '/commission', t.form.title, t.form.text)
}

/**
 * One form, four entry points: ?type=restaurant|art|tiles|custom&ref=<product/work slug or free text>
 * A slug shows the piece's title; any other ref (e.g. "Plates" from the restaurant list) is shown as is.
 */
const Commission = async ({ searchParams }: PageProps<'/[lang]/commission'>) => {
  const { lang, t } = await getT()
  const { type, ref } = await searchParams
  const reference = typeof ref === 'string' && ref.trim() ? (refTitle(ref, lang) ?? ref.slice(0, 80)) : undefined
  return (
    <>
      <PHero small label={t.home.commissionLink} title={t.form.title} text={t.form.text} />
      <section className="form">
        <CommissionForm t={t.form} type={isProjectType(type) ? type : undefined} reference={reference} />
        <aside>
          <figure style={{ height: '100%' }}>
            <Pic src="v3-commission" sizes="30vw" />
          </figure>
        </aside>
      </section>
    </>
  )
}

export default Commission
