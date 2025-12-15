import type { MetadataRoute } from "next"
import { projects } from "@/data/projects"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://my-portfolio-sable-eight-43.vercel.app/"

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/technologies`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/resume`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map(p => ({
    url: `${baseUrl}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes]
}
