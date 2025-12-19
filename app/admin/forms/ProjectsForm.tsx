"use client"

import { useMemo, useState } from "react"
import { saveContent } from "./saveContent"
import type { ProjectsContent, ProjectListKey } from "@/types/projects"

const emptyProject = () => ({
  slug: "",
  title: "",
  description: "",
  technology: "",
  problem: "",
  features: [""],
  challenges: [""],
  learnings: [""],
  stack: [""],
})

export default function ProjectsForm({
  initial,
  onUpdate,
}: {
  initial: ProjectsContent
  onUpdate?: (next: ProjectsContent) => void
}) {
  const [form, setForm] = useState<ProjectsContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSave = useMemo(() => Boolean(form.projects.length >= 0), [form.projects.length])

  async function onSave() {
    setSaving(true)
    setMsg("")
    try {
      await saveContent("projects", form)
      setMsg("Saved")
      onUpdate?.(form)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function updateAllowedTech(i: number, value: string) {
    setForm(s => ({
      ...s,
      allowedTechnologies: s.allowedTechnologies.map((t, idx) => (idx === i ? value : t)),
    }))
  }

  function addAllowedTech() {
    setForm(s => ({ ...s, allowedTechnologies: [...s.allowedTechnologies, ""] }))
  }

  function removeAllowedTech(i: number) {
    setForm(s => ({
      ...s,
      allowedTechnologies: s.allowedTechnologies.filter((_, idx) => idx !== i),
    }))
  }

  function updateProjectField(
    i: number,
    key: "slug" | "title" | "description" | "technology" | "problem",
    value: string
  ) {
    setForm(s => ({
      ...s,
      projects: s.projects.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)),
    }))
  }

  function updateProjectList(i: number, key: ProjectListKey, li: number, value: string) {
    setForm(s => ({
      ...s,
      projects: s.projects.map((p, idx) => {
        if (idx !== i) return p
        const list = (p[key] || []) as string[]
        const next = list.map((x, xidx) => (xidx === li ? value : x))
        return { ...p, [key]: next }
      }),
    }))
  }

  function addProjectListItem(i: number, key: ProjectListKey) {
    setForm(s => ({
      ...s,
      projects: s.projects.map((p, idx) => {
        if (idx !== i) return p
        const list = ((p[key] || []) as string[]).slice()
        list.push("")
        return { ...p, [key]: list }
      }),
    }))
  }

  function removeProjectListItem(i: number, key: ProjectListKey, li: number) {
    setForm(s => ({
      ...s,
      projects: s.projects.map((p, idx) => {
        if (idx !== i) return p
        const list = ((p[key] || []) as string[]).filter((_, xidx) => xidx !== li)
        return { ...p, [key]: list.length ? list : [""] }
      }),
    }))
  }

  function addProject() {
    setForm(s => ({ ...s, projects: [...s.projects, emptyProject()] }))
  }

  function removeProject(i: number) {
    setForm(s => ({ ...s, projects: s.projects.filter((_, idx) => idx !== i) }))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="mt-1 text-sm text-slate-600">Projects content.</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Add project
        </button>
      </div>

      <div className="mt-6 grid gap-8">
        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Allowed technologies</h3>
            <button
              type="button"
              onClick={addAllowedTech}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Add
            </button>
          </div>

          <div className="grid gap-3">
            {form.allowedTechnologies.map((t, i) => (
              <div key={i} className="flex gap-3">
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={t}
                  onChange={e => updateAllowedTech(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeAllowedTech(i)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <h3 className="text-sm font-semibold text-slate-900">Projects</h3>

          <div className="grid gap-6">
            {form.projects.map((p, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-600">Project {i + 1}</div>
                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Slug">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={p.slug}
                      onChange={e => updateProjectField(i, "slug", e.target.value)}
                      placeholder="my-project"
                    />
                  </Field>

                  <Field label="Technology">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={p.technology}
                      onChange={e => updateProjectField(i, "technology", e.target.value)}
                      placeholder="Next.js"
                    />
                  </Field>

                  <Field label="Title">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={p.title}
                      onChange={e => updateProjectField(i, "title", e.target.value)}
                    />
                  </Field>

                  <Field label="Description">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={p.description}
                      onChange={e => updateProjectField(i, "description", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Problem">
                    <textarea
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      rows={3}
                      value={p.problem}
                      onChange={e => updateProjectField(i, "problem", e.target.value)}
                    />
                  </Field>
                </div>

                <ProjectList
                  title="Features"
                  items={p.features}
                  onAdd={() => addProjectListItem(i, "features")}
                  onChange={(li, v) => updateProjectList(i, "features", li, v)}
                  onRemove={li => removeProjectListItem(i, "features", li)}
                />

                <ProjectList
                  title="Challenges"
                  items={p.challenges}
                  onAdd={() => addProjectListItem(i, "challenges")}
                  onChange={(li, v) => updateProjectList(i, "challenges", li, v)}
                  onRemove={li => removeProjectListItem(i, "challenges", li)}
                />

                <ProjectList
                  title="Learnings"
                  items={p.learnings}
                  onAdd={() => addProjectListItem(i, "learnings")}
                  onChange={(li, v) => updateProjectList(i, "learnings", li, v)}
                  onRemove={li => removeProjectListItem(i, "learnings", li)}
                />

                <ProjectList
                  title="Stack"
                  items={p.stack || [""]}
                  onAdd={() => addProjectListItem(i, "stack")}
                  onChange={(li, v) => updateProjectList(i, "stack", li, v)}
                  onRemove={li => removeProjectListItem(i, "stack", li)}
                />
              </div>
            ))}
          </div>
        </section>

        <SaveRow saving={saving} canSave={canSave} msg={msg} onSave={onSave} />
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-slate-600">{label}</div>
      {children}
    </div>
  )
}

function ProjectList({
  title,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string
  items: string[]
  onAdd: () => void
  onChange: (i: number, value: string) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="mt-6 grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Add
        </button>
      </div>

      <div className="grid gap-3">
        {items.map((x, i) => (
          <div key={i} className="flex gap-3">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={x}
              onChange={e => onChange(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SaveRow({
  saving,
  canSave,
  msg,
  onSave,
}: {
  saving: boolean
  canSave: boolean
  msg: string
  onSave: () => void
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        onClick={onSave}
        disabled={!canSave || saving}
        className={[
          "rounded-xl px-4 py-2 text-sm font-semibold transition",
          !canSave || saving
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : "bg-slate-900 text-white hover:bg-slate-700",
        ].join(" ")}
      >
        {saving ? "Saving" : "Save"}
      </button>
      <span className="text-sm text-slate-600">{msg}</span>
    </div>
  )
}
