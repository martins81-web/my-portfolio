"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import ProjectsForm from "./forms/ProjectsForm"
import AboutForm from "./forms/AboutForm"
import HomeForm from "./forms/HomeForm"
import SiteForm from "./forms/SiteForm"
import SeoForm from "./forms/SeoForm"
import ResumeForm from "./forms/ResumeForm"

import type { SiteContent } from "@/types/site"
import type { SeoContent } from "@/types/seo"
import type { HomeContent } from "@/types/home"
import type { AboutContent } from "@/types/about"
import type { ProjectsContent } from "@/types/projects"
import type { ResumeContent } from "@/types/resume"

type TabKey = "projects" | "about" | "home" | "site" | "seo" | "resume"

type InitialState = {
  site: SiteContent
  seo: SeoContent
  home: HomeContent
  about: AboutContent
  projects: ProjectsContent
  resume: ResumeContent
}

export default function AdminDashboard(props: { initial: InitialState }) {
  const router = useRouter()

  const [tab, setTab] = useState<TabKey>("projects")
  const [state, setState] = useState<InitialState>(props.initial)
  const [seed, setSeed] = useState(0)

  useEffect(() => {
    const onFocus = () => router.refresh()
    window.addEventListener("focus", onFocus)
    router.refresh()
    return () => window.removeEventListener("focus", onFocus)
  }, [router])

  useEffect(() => {
    setState(props.initial)
    setSeed(s => s + 1)
  }, [props.initial])

  const content = useMemo(() => {
    const key = `${tab}:${seed}`

    if (tab === "projects")
      return (
        <ProjectsForm
          key={key}
          initial={state.projects}
          onUpdate={v => setState(s => ({ ...s, projects: v }))}
        />
      )

    if (tab === "about")
      return (
        <AboutForm
          key={key}
          initial={state.about}
          onUpdate={v => setState(s => ({ ...s, about: v }))}
        />
      )

    if (tab === "home")
      return (
        <HomeForm
          key={key}
          initial={state.home}
          onUpdate={v => setState(s => ({ ...s, home: v }))}
        />
      )

    if (tab === "site")
      return (
        <SiteForm
          key={key}
          initial={state.site}
          onUpdate={v => setState(s => ({ ...s, site: v }))}
        />
      )

    if (tab === "seo")
      return (
        <SeoForm
          key={key}
          initial={state.seo}
          onUpdate={v => setState(s => ({ ...s, seo: v }))}
        />
      )

    return (
      <ResumeForm
        key={key}
        initial={state.resume}
        onUpdate={v => setState(s => ({ ...s, resume: v }))}
      />
    )
  }, [seed, state, tab])

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-2 text-sm text-slate-600">Edit content using forms. Saves to GitHub.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-2">
            <TabButton active={tab === "projects"} onClick={() => setTab("projects")} label="Projects" />
            <TabButton active={tab === "about"} onClick={() => setTab("about")} label="About" />
            <TabButton active={tab === "home"} onClick={() => setTab("home")} label="Home" />
            <TabButton active={tab === "site"} onClick={() => setTab("site")} label="Site" />
            <TabButton active={tab === "seo"} onClick={() => setTab("seo")} label="SEO" />
            <TabButton active={tab === "resume"} onClick={() => setTab("resume")} label="Resume" />
          </div>
        </div>

        <div>{content}</div>
      </div>
    </div>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition",
        active ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50 text-slate-900",
      ].join(" ")}
    >
      {label}
    </button>
  )
}
