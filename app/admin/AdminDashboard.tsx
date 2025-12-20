"use client"

import { useMemo, useState, useEffect } from "react"
import type { SiteContent } from "@/types/site"
import type { SeoContent } from "@/types/seo"
import type { HomeContent } from "@/types/home"
import type { AboutContent } from "@/types/about"
import type { ProjectsContent } from "@/types/projects"
import type { ResumeContent } from "@/types/resume"

import ProjectsForm from "./forms/ProjectsForm"
import AboutForm from "./forms/AboutForm"
import HomeForm from "./forms/HomeForm"
import SiteForm from "./forms/SiteForm"
import SeoForm from "./forms/SeoForm"
import ResumeForm from "./forms/ResumeForm"

type TabKey = "projects" | "about" | "home" | "site" | "seo" | "resume"

export default function AdminDashboard(props: {
  initial: {
    site: SiteContent
    seo: SeoContent
    home: HomeContent
    about: AboutContent
    projects: ProjectsContent
    resume: ResumeContent
  }
}) {
  const [tab, setTab] = useState<TabKey>("projects")

  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) window.location.reload()
    }

    function onPopState() {
      // sometimes popstate is used for back/forward navigation; reload to ensure fresh data
      window.location.reload()
    }

    window.addEventListener("pageshow", onPageShow as EventListener)
    window.addEventListener("popstate", onPopState)

    return () => {
      window.removeEventListener("pageshow", onPageShow as EventListener)
      window.removeEventListener("popstate", onPopState)
    }
  }, [])

  const content = useMemo(() => {
    if (tab === "projects") return <ProjectsForm initial={props.initial.projects} />
    if (tab === "about") return <AboutForm initial={props.initial.about} />
    if (tab === "home") return <HomeForm initial={props.initial.home} />
    if (tab === "site") return <SiteForm initial={props.initial.site} />
    if (tab === "seo") return <SeoForm initial={props.initial.seo} />
    return <ResumeForm initial={props.initial.resume} />
  }, [tab, props.initial])

  return (
    <div className="flex gap-6">
      <aside className="w-60">
        <h1 className="mt-0 text-2xl font-bold">Admin</h1>
        <div className="opacity-80 mb-3 text-sm">Edit content using forms. Saves to GitHub.</div>

        <nav className="flex flex-col gap-2">
          <button
            className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold ${tab === "projects" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"}`}
            onClick={() => setTab("projects")}
          >
            Projects
          </button>

          <button
            className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold ${tab === "about" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"}`}
            onClick={() => setTab("about")}
          >
            About
          </button>

          <button
            className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold ${tab === "home" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"}`}
            onClick={() => setTab("home")}
          >
            Home
          </button>

          <button
            className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold ${tab === "site" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"}`}
            onClick={() => setTab("site")}
          >
            Site
          </button>

          <button
            className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold ${tab === "seo" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"}`}
            onClick={() => setTab("seo")}
          >
            SEO
          </button>

          <button
            className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold ${tab === "resume" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"}`}
            onClick={() => setTab("resume")}
          >
            Resume
          </button>
        </nav>
      </aside>

      <main className="flex-1">{content}</main>
    </div>
  )
}
