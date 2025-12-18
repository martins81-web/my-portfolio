
import type { TechnologyKey } from "./technologies"
import type { Metadata } from "next"

export const projectsMeta: Pick<Metadata, "title" | "description"> = {
  title: "Projects",
  description: "Projects built with React, Angular, Vue, and Next.js.",
}

export type ProjectTechnology = TechnologyKey

export type Project = {
  slug: string
  title: string
  description: string
  technology: TechnologyKey
  stack?: string[]
  problem: string
  features: string[]
  challenges: string[]
  learnings: string[]
}

export const projects: Project[] = [
  {
    slug: "react-admin-dashboard",
    title: "Smart Admin Dashboard",
    description: "Admin dashboard with charts, tables and API integration.",
    technology: "React",
    stack: ["React", "TypeScript", "Charts", "REST API"],
    problem:
      "Internal teams need a clear and fast way to visualize data and manage users.",
    features: [
      "Reusable UI components",
      "API integration with loading and error states",
      "Dashboard charts and data tables",
    ],
    challenges: [
      "Managing state across multiple components",
      "Keeping components reusable and maintainable",
    ],
    learnings: ["Improved component design", "Better separation of concerns"],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}
