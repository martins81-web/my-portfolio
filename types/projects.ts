export type ProjectListKey = "features" | "challenges" | "learnings" | "stack"

export type ProjectContentItem = {
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

export type ProjectsContent = {
  allowedTechnologies: string[]
  projects: ProjectContentItem[]
}
