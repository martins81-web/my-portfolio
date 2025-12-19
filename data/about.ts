// data/about.ts
import type { Metadata } from "next"
import { fetchGithubJson } from "@/lib/content"

export type AboutProof = { label: string; value: string }

export type AboutTimelineItem = {
  period: string
  title: string
  org: string
  bullets: string[]
}

export type AboutSkillGroup = { title: string; items: string[] }

export type AboutProfile = {
  name: string
  headline: string
  location: string
  email: string
  summary: string
  avatarUrl?: string
}

export type AboutJson = {
  aboutMeta: Pick<Metadata, "title" | "description">
  aboutProfile: AboutProfile
  aboutProof: AboutProof[]
  aboutTimeline: AboutTimelineItem[]
  aboutSkills: AboutSkillGroup[]
}

export async function getAbout() {
  return fetchGithubJson<AboutJson>({
    path: "data/content/about.json",
  })
}
