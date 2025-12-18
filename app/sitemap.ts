import type { MetadataRoute } from "next"
import { getProjectsData } from "@/data/projects"

function getBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) return "http://localhost:3000"
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const data = await getProjectsData()
  const projectUrls = data.projects.map(p => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
  }))

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...projectUrls,
  ]
}
