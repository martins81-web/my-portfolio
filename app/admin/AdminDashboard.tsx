"use client"

import { useMemo, useState } from "react"
import SiteForm from "./forms/SiteForm"
import SeoForm from "./forms/SeoForm"
import HomeForm from "./forms/HomeForm"
import AboutForm from "./forms/AboutForm"
import ProjectsForm from "./forms/ProjectsForm"



type AdminInitial = {
  site: any
  seo: any
  home: any
  about: any
  projects: any
}

type TabKey = "site" | "seo" | "home" | "about" | "projects"

export default function AdminDashboard({ initial }: { initial: AdminInitial }) {
  const [active, setActive] = useState<TabKey>("projects")

  const tabs = useMemo(
    () =>
      [
        { key: "projects" as const, label: "Projects" },
        { key: "about" as const, label: "About" },
        { key: "home" as const, label: "Home" },
        { key: "site" as const, label: "Site" },
        { key: "seo" as const, label: "SEO" },
      ] as const,
    []
  )

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-sm text-slate-600">
          Edit content using forms. Saves to GitHub.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <nav className="flex flex-col gap-1">
            {tabs.map(t => {
              const on = t.key === active
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={[
                    "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                    on
                      ? "bg-slate-900 text-white"
                      : "text-slate-800 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          {active === "site" ? <SiteForm initial={initial.site} /> : null}
          {active === "seo" ? <SeoForm initial={initial.seo} /> : null}
          {active === "home" ? <HomeForm initial={initial.home} /> : null}
          {active === "about" ? <AboutForm initial={initial.about} /> : null}
          {active === "projects" ? <ProjectsForm initial={initial.projects} /> : null}
        </section>
      </div>
    </main>
  )
}
