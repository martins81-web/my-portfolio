import Link from "next/link"
import type { Metadata } from "next"
import ProjectCard from "../components/ProjectCard"
import { getHome } from "../data/home"
import { getProjectsData } from "../data/projects"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Eric Martins portfolio. Front End and API Developer specialized in React, Angular, Next.js and API integration.",
}

export default async function HomePage() {
  const [home, projectsData] = await Promise.all([getHome(), getProjectsData()])

  const featuredProjects = projectsData.projects.filter(p =>
    home.featuredProjectSlugs.includes(p.slug)
  )

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(900px circle at 20% 10%, rgba(15,23,42,0.08), transparent 60%), radial-gradient(700px circle at 85% 35%, rgba(15,23,42,0.05), transparent 55%)",
          }}
        />

        <div className="relative max-w-3xl">
          <p className="text-sm text-slate-600">{home.homeHero.subtitle}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {home.homeHero.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{home.homeHero.description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={home.homeHero.primaryCta.href}
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
            >
              {home.homeHero.primaryCta.label}
            </Link>
            <Link
              href={home.homeHero.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
            >
              {home.homeHero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {home.homeHighlights.map(h => (
          <div
            key={h.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{h.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{h.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Featured projects</h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {featuredProjects.map(p => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {home.testimonials.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Testimonials</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {home.testimonials.map(t => (
              <figure
                key={t.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <blockquote className="text-sm text-slate-700">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{t.name}</span>{" "}
                  {t.role ? `· ${t.role}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
