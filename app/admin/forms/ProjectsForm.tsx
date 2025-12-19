"use client"

import { useMemo, useState } from "react"
import { saveContent } from "./saveContent"

type ProjectsJson = {
  allowedTechnologies: string[]
  projects: Array<{
    slug: string
    title: string
    description: string
    technology: string
    problem: string
    features: string[]
    challenges: string[]
    learnings: string[]
    stack?: string[]
  }>
}

const emptyProject = (): ProjectsJson["projects"][number] => ({
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

export default function ProjectsForm({ initial }: { initial: ProjectsJson }) {
  const [form, setForm] = useState<ProjectsJson>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSave = useMemo(() => {
    if (!form.projects.length) return true
    return form.projects.every(p => p.slug.trim() && p.title.trim())
  }, [form.projects])

  async function onSave() {
    setSaving(true)
    setMsg("")
    try {
      await saveContent("projects", form)
      setMsg("Saved")
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
    key: keyof ProjectsJson["projects"][number],
    value: any
  ) {
    setForm(s => ({
      ...s,
      projects: s.projects.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)),
    }))
  }

  function addProject() {
    setForm(s => ({ ...s, projects: [...s.projects, emptyProject()] }))
  }

  function removeProject(i: number) {
    setForm(s => ({ ...s, projects: s.projects.filter((_, idx) => idx !== i) }))
  }

  function updateStringList(
    projectIndex: number,
    key: "features" | "challenges" | "learnings" | "stack",
    itemIndex: number,
    value: string
  ) {
    setForm(s => ({
      ...s,
      projects: s.projects.map((p, idx) => {
        if (idx !== projectIndex) return p
        const list = (p[key] ?? []) as string[]
        const next = list.map((x, ii) => (ii === itemIndex ? value : x))
        return { ...p, [key]: next }
      }),
    }))
  }

  function addStringListItem(
    projectIndex: number,
    key: "features" | "challenges" | "learnings" | "stack"
  ) {
    setForm(s => ({
      ...s,
      projects: s.projects.map((p, idx) => {
        if (idx !== projectIndex) return p
        const list = (p[key] ?? []) as string[]
        return { ...p, [key]: [...list, ""] }
      }),
    }))
  }

  function removeStringListItem(
    projectIndex: number,
    key: "features" | "challenges" | "learnings" | "stack",
    itemIndex: number
  ) {
    setForm(s => ({
      ...s,
      projects: s.projects.map((p, idx) => {
        if (idx !== projectIndex) return p
        const list = (p[key] ?? []) as string[]
        const next = list.filter((_, ii) => ii !== itemIndex)
        return { ...p, [key]: next.length ? next : [""] }
      }),
    }))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Projects</h2>
      <p className="mt-1 text-sm text-slate-600">Projects content.</p>

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
                  placeholder="React"
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
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
            <button
              type="button"
              onClick={addProject}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Add project
            </button>
          </div>

          <div className="grid gap-5">
            {form.projects.map((p, i) => {
              const techOptions = form.allowedTechnologies
                .map(x => x.trim())
                .filter(Boolean)

              const showTech = p.technology.trim()
              const selectOptions = showTech && !techOptions.includes(showTech)
                ? [showTech, ...techOptions]
                : techOptions

              return (
                <div key={i} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-600">
                        Project {i + 1}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        Slug and title are required
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeProject(i)}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Slug">
                      <input
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        value={p.slug}
                        onChange={e => updateProjectField(i, "slug", e.target.value)}
                        placeholder="react-admin-dashboard"
                      />
                    </Field>

                    <Field label="Technology">
                      <select
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                        value={p.technology}
                        onChange={e => updateProjectField(i, "technology", e.target.value)}
                      >
                        <option value="">Select</option>
                        {selectOptions.map(opt => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <ListEditor
                      title="Features"
                      items={p.features}
                      onAdd={() => addStringListItem(i, "features")}
                      onChange={(ii, v) => updateStringList(i, "features", ii, v)}
                      onRemove={ii => removeStringListItem(i, "features", ii)}
                    />
                    <ListEditor
                      title="Challenges"
                      items={p.challenges}
                      onAdd={() => addStringListItem(i, "challenges")}
                      onChange={(ii, v) => updateStringList(i, "challenges", ii, v)}
                      onRemove={ii => removeStringListItem(i, "challenges", ii)}
                    />
                    <ListEditor
                      title="Learnings"
                      items={p.learnings}
                      onAdd={() => addStringListItem(i, "learnings")}
                      onChange={(ii, v) => updateStringList(i, "learnings", ii, v)}
                      onRemove={ii => removeStringListItem(i, "learnings", ii)}
                    />
                    <ListEditor
                      title="Stack"
                      items={p.stack ?? [""]}
                      onAdd={() => addStringListItem(i, "stack")}
                      onChange={(ii, v) => updateStringList(i, "stack", ii, v)}
                      onRemove={ii => removeStringListItem(i, "stack", ii)}
                      placeholder="TypeScript"
                    />
                  </div>
                </div>
              )
            })}
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

function ListEditor({
  title,
  items,
  onAdd,
  onChange,
  onRemove,
  placeholder,
}: {
  title: string
  items: string[]
  onAdd: () => void
  onChange: (index: number, value: string) => void
  onRemove: (index: number) => void
  placeholder?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-600">{title}</p>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
        >
          Add
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        {items.map((x, i) => (
          <div key={i} className="flex gap-3">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={x}
              onChange={e => onChange(i, e.target.value)}
              placeholder={placeholder}
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
