export const seo = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: "Eric Martins",
  defaultTitle: "Eric Martins | Front-End & API Developer",
  titleTemplate: "%s | Eric Martins",
  description:
    "Front-End and API Developer specialized in React, Angular, Next.js and API integration.",
  openGraph: {
    type: "website" as const,
    url: "/",
  },
  twitter: {
    card: "summary_large_image" as const,
  },
  robots: { index: true, follow: true },
}
