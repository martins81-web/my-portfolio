import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "About Eric Martins, Front End and API Developer.",
}

const highlights = [
  {
    title: "Front End engineering",
    text: "React, Angular, Next.js, TypeScript, and accessible UI patterns.",
  },
  {
    title: "API integration",
    text: "Clean data flows, validation, error handling, and performance.",
  },
  {
    title: "Delivery mindset",
    text: "Readable code, consistent UX, and practical solutions.",
  },
]

const skills = [
  "Next.js",
  "React",
  "Angular",
  "TypeScript",
  "Tailwind CSS",
  "JavaScript",
  "REST APIs",
  "UI Design Systems",
  "Accessibility",
  "Performance",
]

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10 grid gap-6 lg:grid-cols-3 lg:items-end">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">About</h1>
          <p className="text-slate-600 max-w-2xl">
            I’m Eric Martins, a Front End and API Developer focused on building
            clean interfaces and reliable integrations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-white text-sm font-medium hover:bg-slate-700 transition"
          >
            View projects
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
          >
            View resume
          </Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map(item => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Short bio</h2>
          <div className="mt-3 space-y-3 text-slate-700">
            <p>
              I build modern web applications with strong TypeScript foundations,
              clean UI, and reliable data flows.
            </p>
            <p>
              I enjoy turning complex requirements into simple user experiences,
              with a focus on performance, accessibility, and maintainable code.
            </p>
            <p>
              I work comfortably across React, Angular, and Next.js projects, and
              I can integrate APIs end to end from UI to validation and error
              states.
            </p>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map(s => (
              <span
                key={s}
                className="text-xs rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
            >
              Contact
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}
