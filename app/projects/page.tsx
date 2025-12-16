import type { Metadata } from "next"
import { Suspense } from "react"
import ProjectsClient from "./ProjectsClient"

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects built with React, Angular, Vue, and Next.js.",
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsFallback />}>
      <ProjectsClient />
    </Suspense>
  )
}

function ProjectsFallback() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="h-5 w-32 rounded bg-slate-100" />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-slate-100 border border-slate-200" />
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="h-5 w-2/3 rounded bg-slate-100" />
            <div className="mt-3 h-4 w-full rounded bg-slate-100" />
            <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
            <div className="mt-6 flex gap-2">
              <div className="h-6 w-16 rounded-full bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
