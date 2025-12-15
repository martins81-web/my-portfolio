import Link from 'next/link'

type Project = {
  slug: string
  title: string
  description: string
  technology: 'React' | 'Angular' | 'Vue' | 'Next.js'
  stack?: string[]
}

export default function ProjectCard({ project }: { project: Project }) {
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

      {project.stack && project.stack.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-4">
    {project.stack.map(tech => (
      <span
        key={tech}
        className="text-xs rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"
      >
        {tech}
      </span>
    ))}
  </div>
)}

      <span className="text-sm font-medium text-slate-900">
        View project →
      </span>
    </Link>
  )
}
