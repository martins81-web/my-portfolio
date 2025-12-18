import data from "./content/projects.json"

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

const parsed = data as unknown as ProjectsJson

export const allowedTechnologies: string[] =
  parsed.allowedTechnologies ?? ["React", "Angular", "Vue", "Next.js"]

export const projects: Project[] = parsed.projects

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}
