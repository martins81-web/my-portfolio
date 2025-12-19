"use client"

import { useMemo, useState } from "react"

import ProjectsForm from "./forms/ProjectsForm"
import AboutForm from "./forms/AboutForm"
import HomeForm from "./forms/HomeForm"
import SiteForm from "./forms/SiteForm"
import SeoForm from "./forms/SeoForm"
import ResumeForm from "./forms/ResumeForm"

type TabKey = "projects" | "about" | "home" | "site" | "seo" | "resume"

export default function AdminDashboard(props: {
  initial: {
    site: any
    seo: any
    home: any
    about: any
    projects: any
    resume: { resumeUrl: string }
  }
}) {
  const [tab, setTab] = useState<TabKey>("projects")

  const content = useMemo(() => {
    if (tab === "projects") return <ProjectsForm initial={props.initial.projects} />
    if (tab === "about") return <AboutForm initial={props.initial.about} />
    if (tab === "home") return <HomeForm initial={props.initial.home} />
    if (tab === "site") return <SiteForm initial={props.initial.site} />
    if (tab === "seo") return <SeoForm initial={props.initial.seo} />
    return <ResumeForm initial={props.initial.resume} />
  }, [tab, props.initial])

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ width: 240 }}>
        <h1 style={{ marginTop: 0 }}>Admin</h1>
        <div style={{ opacity: 0.8, marginBottom: 12 }}>Edit content using forms. Saves to GitHub.</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => setTab("projects")}>Projects</button>
          <button onClick={() => setTab("about")}>About</button>
          <button onClick={() => setTab("home")}>Home</button>
          <button onClick={() => setTab("site")}>Site</button>
          <button onClick={() => setTab("seo")}>SEO</button>
          <button onClick={() => setTab("resume")}>Resume</button>
        </div>
      </div>

      <div style={{ flex: 1 }}>{content}</div>
    </div>
  )
}
