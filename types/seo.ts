export const OPEN_GRAPH_TYPES = ["website", "article", "profile", "book"] as const
export type OpenGraphType = (typeof OPEN_GRAPH_TYPES)[number]

export const TWITTER_CARDS = ["summary", "summary_large_image", "app", "player"] as const
export type TwitterCard = (typeof TWITTER_CARDS)[number]

export type SeoContent = {
  siteName: string
  defaultTitle: string
  titleTemplate: string
  description: string
  openGraph: { type: OpenGraphType; url: string }
  twitter: { card: TwitterCard }
  robots: { index: boolean; follow: boolean }
}
