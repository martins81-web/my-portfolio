"use client"

import { useMemo, useState } from "react"
import { saveContent } from "./saveContent"

type Site = {
  name: string
  email: string
  location: string
  socials: {
    github?: string
    linkedin?: string
  }
}

export default function SiteForm({ initial }: { initial: Site }) {
  const [form, setForm] = useState<Site>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSave = useMemo(() => Boolean(form.name.trim() && form.email.trim()), [form])

  async function onSave() {
    setSaving(true)
    setMsg("")
    try {
      await saveContent("site", form)
      setMsg("Saved")
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Site</h2>
      <p className="mt-1 text-sm text-slate-600">Global settings used across pages.</p>

      <div className="mt-6 grid gap-5">
        <Field label="Name">
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={form.name}
            onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.email}
              onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
            />
          </Field>

          <Field label="Location">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.location}
              onChange={e => setForm(s => ({ ...s, location: e.target.value }))}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="GitHub URL">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.socials.github ?? ""}
              onChange={e =>
                setForm(s => ({ ...s, socials: { ...s.socials, github: e.target.value } }))
              }
            />
          </Field>

          <Field label="LinkedIn URL">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.socials.linkedin ?? ""}
              onChange={e =>
                setForm(s => ({ ...s, socials: { ...s.socials, linkedin: e.target.value } }))
              }
            />
          </Field>
        </div>

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
