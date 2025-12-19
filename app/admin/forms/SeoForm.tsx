"use client"

import { useMemo, useState } from "react"
import { saveContent } from "./saveContent"

type Seo = {
  siteName: string
  defaultTitle: string
  titleTemplate: string
  description: string
  openGraph: { type: string; url: string }
  twitter: { card: string }
  robots: { index: boolean; follow: boolean }
}

export default function SeoForm({ initial }: { initial: Seo }) {
  const [form, setForm] = useState<Seo>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSave = useMemo(() => Boolean(form.siteName.trim() && form.defaultTitle.trim()), [form])

  async function onSave() {
    setSaving(true)
    setMsg("")
    try {
      await saveContent("seo", form)
      setMsg("Saved")
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">SEO</h2>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Site name">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.siteName}
              onChange={e => setForm(s => ({ ...s, siteName: e.target.value }))}
            />
          </Field>

          <Field label="Default title">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.defaultTitle}
              onChange={e => setForm(s => ({ ...s, defaultTitle: e.target.value }))}
            />
          </Field>
        </div>

        <Field label="Title template">
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={form.titleTemplate}
            onChange={e => setForm(s => ({ ...s, titleTemplate: e.target.value }))}
          />
        </Field>

        <Field label="Description">
          <textarea
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            rows={3}
            value={form.description}
            onChange={e => setForm(s => ({ ...s, description: e.target.value }))}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="OpenGraph type">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.openGraph.type}
              onChange={e =>
                setForm(s => ({ ...s, openGraph: { ...s.openGraph, type: e.target.value } }))
              }
            />
          </Field>

          <Field label="OpenGraph url">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.openGraph.url}
              onChange={e =>
                setForm(s => ({ ...s, openGraph: { ...s.openGraph, url: e.target.value } }))
              }
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Twitter card">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.twitter.card}
              onChange={e => setForm(s => ({ ...s, twitter: { ...s.twitter, card: e.target.value } }))}
            />
          </Field>

          <Field label="Robots index">
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.robots.index ? "true" : "false"}
              onChange={e => setForm(s => ({ ...s, robots: { ...s.robots, index: e.target.value === "true" } }))}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </Field>

          <Field label="Robots follow">
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.robots.follow ? "true" : "false"}
              onChange={e => setForm(s => ({ ...s, robots: { ...s.robots, follow: e.target.value === "true" } }))}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
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
