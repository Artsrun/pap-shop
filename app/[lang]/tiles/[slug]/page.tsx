import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/blocks'
import { projects } from '@/lib/content'
import { pageMeta } from '@/lib/meta'
import { getT } from '@/lib/t'

export const dynamicParams = false
export const generateStaticParams = () => projects.filter((p) => p.kind === 'tiles').map(({ slug }) => ({ slug }))

const find = (slug: string) => projects.find((p) => p.kind === 'tiles' && p.slug === slug)

export const generateMetadata = async ({ params }: PageProps<'/[lang]/tiles/[slug]'>) => {
  const { lang } = await getT()
  const { slug } = await params
  return pageMeta(lang, `/tiles/${slug}`, find(slug)?.name)
}

const TileProject = async ({ params }: PageProps<'/[lang]/tiles/[slug]'>) => {
  const project = find((await params).slug)
  if (!project) notFound()
  return <ProjectDetail project={project} />
}

export default TileProject
