import { fetchGithubJson } from "@/lib/content"

export type Project = {
  slug: string
  title: string
  description: string
  technology: string
  problem: string
  features: string[]
  challenges: string[]
  learnings: string[]
  stack?: string[]
}

type ProjectsJson = {
  allowedTechnologies?: string[]
  projects: Project[]
}

export async function getProjectsData() {
  return fetchGithubJson<ProjectsJson>({
  path: "data/content/projects.json",
})

}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const data = await getProjectsData()
  return data.projects.find(p => p.slug === slug)
}
