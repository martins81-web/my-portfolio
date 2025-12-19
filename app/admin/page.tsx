import { fetchGithubJson } from "@/lib/content"
import AdminDashboard from "./AdminDashboard"

export const dynamic = "force-dynamic"

type SiteJson = {
  name: string
  email: string
  location: string
  socials: { github?: string; linkedin?: string }
}

type SeoJson = {
  siteName: string
  defaultTitle: string
  titleTemplate: string
  description: string
  openGraph: { type: string; url: string }
  twitter: { card: string }
  robots: { index: boolean; follow: boolean }
}

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

type AboutJson = {
  aboutMeta: { title: string; description: string }
  aboutProfile: {
    name: string
    headline: string
    location: string
    email: string
    summary: string
  }
  aboutProof: { label: string; value: string }[]
  aboutTimeline: { period: string; title: string; org: string; bullets: string[] }[]
  aboutSkills: { title: string; items: string[] }[]
}

type ProjectsJson = {
  allowedTechnologies: string[]
  projects: Array<{
    slug: string
    title: string
    description: string
    technology: string
    problem: string
    features: string[]
    challenges: string[]
    learnings: string[]
    stack?: string[]
  }>
}

export default async function AdminPage() {
  const [site, seo, home, about, projects] = await Promise.all([
    fetchGithubJson<SiteJson>({ path: "data/content/site.json" }),
    fetchGithubJson<SeoJson>({ path: "data/content/seo.json" }),
    fetchGithubJson<HomeJson>({ path: "data/content/home.json" }),
    fetchGithubJson<AboutJson>({ path: "data/content/about.json" }),
    fetchGithubJson<ProjectsJson>({ path: "data/content/projects.json" }),
  ])

  return (
    <AdminDashboard
      initial={{
        site,
        seo,
        home,
        about,
        projects,
      }}
    />
  )
}
