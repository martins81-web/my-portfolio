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

export type AboutContent = {
  aboutMeta: { title: string; description: string }
  aboutProfile: AboutProfile
  aboutProof: AboutProof[]
  aboutTimeline: AboutTimelineItem[]
  aboutSkills: AboutSkillGroup[]
}
