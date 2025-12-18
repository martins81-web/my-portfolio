import "./globals.css"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getSeo } from "../data/seo"


export const dynamic = "force-dynamic"


export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo()

  return {
    metadataBase: new URL(seo.siteUrl),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.description,
    openGraph: {
      type: seo.openGraph.type,
      title: seo.defaultTitle,
      description: seo.description,
      url: seo.openGraph.url,
    },
    twitter: {
      card: seo.twitter.card,
      title: seo.defaultTitle,
      description: seo.description,
    },
    robots: seo.robots,
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Navigation />

        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="py-10">{children}</div>

          <div className="mt-6 h-px w-full bg-slate-200" />
        </div>

        <Footer />
      </body>
    </html>
  )
}
