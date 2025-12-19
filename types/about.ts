export type AboutContent = {
  aboutMeta: { title: string; description: string }
  aboutProfile: {
    name: string
    headline: string
    location: string
    email: string
    summary: string
  }
  aboutProof: Array<{ label: string; value: string }>
  aboutTimeline: Array<{
    period: string
    title: string
    org: string
    bullets: string[]
  }>
  aboutSkills: Array<{ title: string; items: string[] }>
}
