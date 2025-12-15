import { projects } from '../../../data/projects'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Params = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return { title: 'Project not found' }
  }

  return {
    title: `${project.title} | Eric Martins`,
    description: project.description,
  }
}


type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params

  const project = projects.find(
    p => p.slug === slug
  )

  if (!project) {
    notFound()
  }

  return (
    <main className="p-8 max-w-3xl text-slate-800">
  <h1 className="text-3xl font-bold">
    {project.title}
  </h1>

  <p className="mt-4 text-slate-600">
    {project.description}
  </p>

  <section className="mt-8">
    <h2 className="text-xl font-semibold">Problem</h2>
    <p className="mt-2">
      {project.problem}
    </p>
  </section>

  <section className="mt-8">
    <h2 className="text-xl font-semibold">Key Features</h2>
    <ul className="mt-2 list-disc pl-5">
      {project.features.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
  </section>

  <section className="mt-8">
    <h2 className="text-xl font-semibold">Challenges</h2>
    <ul className="mt-2 list-disc pl-5">
      {project.challenges.map((challenge) => (
        <li key={challenge}>{challenge}</li>
      ))}
    </ul>
  </section>

  <section className="mt-8">
    <h2 className="text-xl font-semibold">What I Learned</h2>
    <ul className="mt-2 list-disc pl-5">
      {project.learnings.map((learning) => (
        <li key={learning}>{learning}</li>
      ))}
    </ul>
  </section>
</main>

  )
}
