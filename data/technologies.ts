export type TechnologyKey = "React" | "Angular" | "Vue" | "Next.js"

export type Technology = {
  key: TechnologyKey
  label: string
  description: string
  strengths: string[]
}

export const technologies: Technology[] = [
  {
    key: "React",
    label: "React",
    description: "Component driven UI with a large ecosystem.",
    strengths: ["Reusable components", "State management patterns", "UI performance"],
  },
  {
    key: "Angular",
    label: "Angular",
    description: "Structured framework for large applications.",
    strengths: ["TypeScript first", "Strong architecture", "Forms and validation"],
  },
  {
    key: "Vue",
    label: "Vue",
    description: "Progressive framework with a clean developer experience.",
    strengths: ["Simple composition", "Great reactivity", "Fast iteration"],
  },
  {
    key: "Next.js",
    label: "Next.js",
    description: "Full stack React framework with routing and SEO tooling.",
    strengths: ["App Router", "SSR and SSG", "Metadata and SEO"],
  },
]

export const technologyKeys = technologies.map(t => t.key)
