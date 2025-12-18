import type { Metadata } from "next"
import about from "./content/about.json"

export type AboutProof = { label: string; value: string }

export type AboutTimelineItem = {
  period: string
  title: string
  org: string
  bullets: string[]
}

export type AboutSkillGroup = { title: string; items: string[] }

export const aboutMeta: Pick<Metadata, "title" | "description"> = about.aboutMeta
export const aboutProfile = about.aboutProfile
export const aboutProof: AboutProof[] = about.aboutProof
export const aboutTimeline: AboutTimelineItem[] = about.aboutTimeline
export const aboutSkills: AboutSkillGroup[] = about.aboutSkills