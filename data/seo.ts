import { fetchGithubJson } from "@/lib/content"

type SeoJson = {
  siteName: string
  defaultTitle: string
  titleTemplate: string
  description: string
  openGraph: { type: string; url: string }
  twitter: { card: string }
  robots: { index: boolean; follow: boolean }
}

export async function getSeo() {
  const data = await fetchGithubJson<SeoJson>({
    path: "data/content/seo.json",
  })

  const openGraphType = data.openGraph.type as "website" | "article" | "profile" | "book"
  const twitterCard = data.twitter.card as "summary" | "summary_large_image" | "app" | "player"

  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: data.siteName,
    defaultTitle: data.defaultTitle,
    titleTemplate: data.titleTemplate,
    description: data.description,
    openGraph: { ...data.openGraph, type: openGraphType },
    twitter: { ...data.twitter, card: twitterCard },
    robots: data.robots,
  }
}
