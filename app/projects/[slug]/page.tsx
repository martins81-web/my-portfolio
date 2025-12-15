import { notFound } from "next/navigation"
import { getProjectBySlug } from "@/data/projects"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return notFound()

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="mt-3 text-slate-600">{project.description}</p>
    </main>
  )
}
