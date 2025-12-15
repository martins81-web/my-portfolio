import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProjectBySlug } from "@/data/projects"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    }
  }

  const title = `${project.title} | Eric Martins`

  return {
    title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.description,
      url: `/projects/${project.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return notFound()

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="mt-3 text-slate-600">{project.description}</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Problem</h2>
        <p className="mt-2 text-slate-700">{project.problem}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="mt-2 list-disc pl-5 text-slate-700">
          {project.features.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Challenges</h2>
        <ul className="mt-2 list-disc pl-5 text-slate-700">
          {project.challenges.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Learnings</h2>
        <ul className="mt-2 list-disc pl-5 text-slate-700">
          {project.learnings.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
