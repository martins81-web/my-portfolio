"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { projects } from "../../data/projects"
import ProjectCard from "../../components/ProjectCard"

const technologies = ["All", "React", "Angular", "Vue", "Next.js"] as const
type TechFilter = (typeof technologies)[number]

function isTechFilter(value: string | null): value is TechFilter {
  return Boolean(value && (technologies as readonly string[]).includes(value))
}

export default function ProjectsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initial = searchParams.get("tech")
  const [filter, setFilter] = useState<TechFilter>(
    isTechFilter(initial) ? initial : "All"
  )

  useEffect(() => {
    const current = searchParams.get("tech")
    if (isTechFilter(current)) setFilter(current)
    else setFilter("All")
  }, [searchParams])

  const filteredProjects = useMemo(() => {
    return filter === "All"
      ? projects
      : projects.filter(p => p.technology === filter)
  }, [filter])

  function setTech(next: TechFilter) {
    setFilter(next)

    const params = new URLSearchParams(searchParams.toString())
    if (next === "All") params.delete("tech")
    else params.set("tech", next)

    const qs = params.toString()
    router.replace(qs ? `/projects?${qs}` : "/projects", { scroll: false })
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-sm text-slate-600">
          {filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {technologies.map(tech => (
          <button
            key={tech}
            onClick={() => setTech(tech)}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              filter === tech
                ? "bg-slate-900 text-white border-slate-900"
                : "border-slate-300 hover:bg-slate-100"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {filteredProjects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </main>
  )
}
