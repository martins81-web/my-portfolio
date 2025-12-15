import Link from "next/link"
import type { ProjectItem } from "@/data/projects"

export default function ProjectCard({ project }: { project: ProjectItem }) {
  const stack = project.stack?.length ? project.stack : [project.technology]

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold mb-2 group-hover:underline">
        {project.title}
      </h3>

      <p className="text-sm text-slate-600 mb-4 line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {stack.map(tech => (
          <span
            key={tech}
            className="text-xs rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"
          >
            {tech}
          </span>
        ))}
      </div>

      <span className="text-sm font-medium text-slate-900">View project →</span>
    </Link>
  )
}
