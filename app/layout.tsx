import "./globals.css"
import Navigation from "../components/Navigation"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { seo } from "../data/seo"
import Footer from "../components/Footer"

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Navigation />
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="py-10">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  )
}
