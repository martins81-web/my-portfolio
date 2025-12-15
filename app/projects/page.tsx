import { Suspense } from "react"
import ProjectsClient from "./ProjectsClient"

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={<div className="max-w-6xl mx-auto px-6 py-12">Loading…</div>}
    >
      <ProjectsClient />
    </Suspense>
  )
}
