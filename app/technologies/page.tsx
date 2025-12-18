import type { Metadata } from "next"
import { technologies } from "../../data/technologies"

export const metadata: Metadata = {
  title: "Technologies",
  description: "Frameworks and tools used across projects.",
}

export default function TechnologiesPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Technologies</h1>
        <p className="text-slate-600 max-w-2xl">
          Frameworks and tools I use to build clean interfaces and reliable integrations.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {technologies.map(t => (
          <section
            key={t.key}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{t.label}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {t.strengths.map(s => (
                <span
                  key={`${t.key}-${s}`}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
