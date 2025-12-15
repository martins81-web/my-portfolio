'use client'

import { useState } from 'react'
import { projects } from '../../data/projects'
import ProjectCard from '../../components/ProjectCard'

const technologies = ['All', 'React', 'Angular', 'Vue', 'Next.js'] as const

export default function ProjectsPage() {
  const [filter, setFilter] =
    useState<(typeof technologies)[number]>('All')

  const filteredProjects =
    filter === 'All'
      ? projects
      : projects.filter(p => p.technology === filter)

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {technologies.map(tech => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              filter === tech
                ? 'bg-slate-900 text-white border-slate-900'
                : 'border-slate-300 hover:bg-slate-100'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </main>
  )
}
