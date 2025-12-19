"use client"

import { useMemo, useState } from "react"
import { saveContent } from "./saveContent"
import type { SiteContent } from "@/types/site"

export default function SiteForm({
  initial,
  onUpdate,
}: {
  initial: SiteContent
  onUpdate?: (next: SiteContent) => void
}) {
  const [form, setForm] = useState<SiteContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSave = useMemo(() => Boolean(form.name.trim() && form.email.trim()), [form])

  async function onSave() {
    setSaving(true)
    setMsg("")
    try {
      await saveContent("site", form)
      setMsg("Saved")
      onUpdate?.(form)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setForm(s => ({ ...s, [key]: value }))
  }

  function updateSocial(key: "github" | "linkedin", value: string) {
    setForm(s => ({ ...s, socials: { ...s.socials, [key]: value || undefined } }))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Site</h2>
      <p className="mt-1 text-sm text-slate-600">Basic site info.</p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.name}
              onChange={e => update("name", e.target.value)}
            />
          </Field>

          <Field label="Email">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.email}
              onChange={e => update("email", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Location">
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={form.location}
            onChange={e => update("location", e.target.value)}
          />
        </Field>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-600">Socials</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="GitHub">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.socials.github || ""}
                onChange={e => updateSocial("github", e.target.value)}
                placeholder="https://github.com/..."
              />
            </Field>

            <Field label="LinkedIn">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.socials.linkedin || ""}
                onChange={e => updateSocial("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
          </div>
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
