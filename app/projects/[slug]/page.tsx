import type { Metadata } from "next"
import { getProjectBySlug } from "@/data/projects"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return { title: "Project not found", description: "Project not found." }
  }

  return {
    title: `${project.title} | Eric Martins`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return <main className="mx-auto max-w-6xl px-6 py-12">Not found</main>
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="mt-3 text-slate-600">{project.description}</p>
    </main>
  )
}
