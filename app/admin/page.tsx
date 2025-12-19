import AdminDashboard from "./AdminDashboard"
import { fetchGithubJson } from "@/lib/content"

import type { SiteContent } from "@/types/site"
import type { SeoContent } from "@/types/seo"
import type { HomeContent } from "@/types/home"
import type { AboutContent } from "@/types/about"
import type { ProjectsContent } from "@/types/projects"
import type { ResumeContent } from "@/types/resume"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const [site, seo, home, about, projects, resume] = await Promise.all([
    fetchGithubJson<SiteContent>({ path: "data/content/site.json" }),
    fetchGithubJson<SeoContent>({ path: "data/content/seo.json" }),
    fetchGithubJson<HomeContent>({ path: "data/content/home.json" }),
    fetchGithubJson<AboutContent>({ path: "data/content/about.json" }),
    fetchGithubJson<ProjectsContent>({ path: "data/content/projects.json" }),
    fetchGithubJson<ResumeContent>({ path: "data/content/resume.json" }),
  ])

  return <AdminDashboard initial={{ site, seo, home, about, projects, resume }} />
}
