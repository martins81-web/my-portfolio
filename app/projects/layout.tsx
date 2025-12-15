import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects built with React, Angular, Vue, and Next.js.",
}

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <section className="max-w-6xl mx-auto px-6 py-12">{children}</section>
}