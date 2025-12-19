"use client"

import { useMemo, useState } from "react"
import { saveContent } from "./saveContent"
import type { SeoContent, OpenGraphType, TwitterCard } from "@/types/seo"
import { OPEN_GRAPH_TYPES, TWITTER_CARDS } from "@/types/seo"

export default function SeoForm({
  initial,
  onUpdate,
}: {
  initial: SeoContent
  onUpdate?: (next: SeoContent) => void
}) {
  const [form, setForm] = useState<SeoContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSave = useMemo(() => {
    return Boolean(form.siteName.trim() && form.defaultTitle.trim() && form.description.trim())
  }, [form.siteName, form.defaultTitle, form.description])

  function patch(next: SeoContent) {
    setForm(next)
    onUpdate?.(next)
  }

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

  function updateRoot<K extends keyof SeoContent>(key: K, value: SeoContent[K]) {
    patch({ ...form, [key]: value })
  }

  function updateRobots(key: "index" | "follow", value: boolean) {
    patch({ ...form, robots: { ...form.robots, [key]: value } })
  }

  function updateOpenGraph<K extends keyof SeoContent["openGraph"]>(
    key: K,
    value: SeoContent["openGraph"][K]
  ) {
    patch({ ...form, openGraph: { ...form.openGraph, [key]: value } })
  }

  function updateTwitter(key: "card", value: TwitterCard) {
    patch({ ...form, twitter: { ...form.twitter, [key]: value } })
  }

  function titleTemplateSuffix() {
    return form.titleTemplate.startsWith("%s") ? form.titleTemplate.slice(2) : form.titleTemplate
  }

  function setTitleTemplateSuffix(suffix: string) {
    patch({ ...form, titleTemplate: `%s${suffix}` })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">SEO</h2>
      <p className="mt-1 text-sm text-slate-600">Site metadata defaults.</p>

      <div className="mt-6 grid gap-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Site name">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.siteName}
              onChange={e => updateRoot("siteName", e.target.value)}
            />
          </Field>

          <Field label="Default title">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={form.defaultTitle}
              onChange={e => updateRoot("defaultTitle", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Title template">
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              %s
            </span>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={titleTemplateSuffix()}
              onChange={e => setTitleTemplateSuffix(e.target.value)}
              placeholder=" | Eric Martins"
            />
          </div>
        </Field>

        <Field label="Description">
          <textarea
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            rows={3}
            value={form.description}
            onChange={e => updateRoot("description", e.target.value)}
          />
        </Field>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-600">Open Graph</p>

            <div className="mt-3 grid gap-3">
              <Field label="Type">
                <select
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={form.openGraph.type}
                  onChange={e => updateOpenGraph("type", e.target.value as OpenGraphType)}
                >
                  {OPEN_GRAPH_TYPES.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="URL">
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={form.openGraph.url}
                  onChange={e => updateOpenGraph("url", e.target.value)}
                  placeholder="https://example.com"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-600">Twitter</p>

            <div className="mt-3 grid gap-3">
              <Field label="Card">
                <select
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={form.twitter.card}
                  onChange={e => updateTwitter("card", e.target.value as TwitterCard)}
                >
                  {TWITTER_CARDS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-600">Robots</p>
          <div className="mt-3 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.robots.index}
                onChange={e => updateRobots("index", e.target.checked)}
              />
              Index
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.robots.follow}
                onChange={e => updateRobots("follow", e.target.checked)}
              />
              Follow
            </label>
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
