export type Project = {
  slug: string
  title: string
  description: string
  technology: "React" | "Angular" | "Vue" | "Next.js"
  problem: string
  features: string[]
  challenges: string[]
  learnings: string[]
  stack?: string[]
}

export const projects: Project[] = [
  {
    slug: "react-admin-dashboard",
    title: "Smart Admin Dashboard",
    description: "Admin dashboard with charts, tables and API integration.",
    technology: "React",
    problem:
      "Internal teams need a clear and fast way to visualize data and manage users.",
    features: ["Reusable UI components"],
    challenges: ["Managing state across multiple components"],
    learnings: ["Improved component design"],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}
