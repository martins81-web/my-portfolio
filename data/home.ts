import { fetchGithubJson } from "@/lib/content"

type HomeJson = {
  homeHero: {
    title: string
    subtitle: string
    description: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
  }
  homeHighlights: { title: string; description: string }[]
  featuredProjectSlugs: string[]
  testimonials: { name: string; role: string; quote: string }[]
}

export async function getHome() {
  return fetchGithubJson<HomeJson>({
  path: "data/content/home.json",
})
}
