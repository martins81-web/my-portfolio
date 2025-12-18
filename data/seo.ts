import data from "./content/seo.json"

const openGraphType = data.openGraph.type as "website" | "article" | "profile" | "book"
const twitterCard = data.twitter.card as "summary" | "summary_large_image" | "app" | "player"

export const seo = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: data.siteName,
  defaultTitle: data.defaultTitle,
  titleTemplate: data.titleTemplate,
  description: data.description,
  openGraph: {
    ...data.openGraph,
    type: openGraphType,
  },
  twitter: {
    ...data.twitter,
    card: twitterCard,
  },
  robots: data.robots,
}
