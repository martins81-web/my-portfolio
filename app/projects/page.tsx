'use client'

import { useState } from 'react'
import Link from 'next/link'
import { projects } from '../../data/projects'


const technologies = ['All', 'React', 'Angular', 'Vue', 'Next.js'] as const

export default function ProjectsPage() {
  const [filter, setFilter] = useState<typeof technologies[number]>('All')

  const filteredProjects =
    filter === 'All'
      ? projects
      : projects.filter(p => p.technology === filter)

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      <div className="flex gap-3 mb-6">
        {technologies.map(tech => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            className={`px-3 py-1 border rounded ${
              filter === tech ? 'bg-slate-900 text-white' : ''
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredProjects.map(project => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="border rounded p-4 block hover:bg-slate-50"
          >
            <h2 className="text-xl font-semibold">
              {project.title}
            </h2>

            <p className="mt-2 text-slate-600 text-sm">
              {project.description}
            </p>

            <p className="mt-3 text-sm font-medium">
              Technology: {project.technology}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
