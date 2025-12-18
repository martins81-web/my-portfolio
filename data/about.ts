import type { Metadata } from "next"


export type AboutProof = { label: string; value: string }
export type AboutTimelineItem = {
  period: string
  title: string
  org: string
  bullets: string[]
}
export type AboutSkillGroup = { title: string; items: string[] }

export const aboutMeta: Pick<Metadata, "title" | "description"> = {
  title: "About",
  description: "About Eric Martins, Front End and API Developer.",
}

export const aboutProfile = {
  name: "Eric Martins",
  headline: "Front End and API Developer",
  location: "Québec, Canada",
  email: "ericmartins81@gmail.com",
  summary:
    "I build clean UI and reliable integrations with TypeScript, modern frameworks, and APIs. I focus on performance, accessibility, and maintainable code.",
}

export const aboutProof: AboutProof[] = [
  { label: "Projects", value: "Add count" },
  { label: "Years experience", value: "Add years" },
  { label: "Industries", value: "Add list" },
  { label: "Clients", value: "Add list" },
]

export const aboutTimeline: AboutTimelineItem[] = [
  {
    period: "2025",
    title: "Front End Developer",
    org: "Add company",
    bullets: ["Add one measurable achievement", "Add one measurable achievement"],
  },
]

export const aboutSkills: AboutSkillGroup[] = [
  { title: "UI", items: ["Accessibility", "Responsive UI"] },
  { title: "Frameworks", items: ["Next.js", "React", "Angular", "Vue"] },
  { title: "APIs", items: ["REST", "Auth flows"] },
  { title: "Tools", items: ["TypeScript", "Git", "Tailwind CSS"] },
]
