"use client"

import { useMemo, useState } from "react"
import type { getSite } from "@/data/site"

type Site = Awaited<ReturnType<typeof getSite>>

export default function SiteForm({ initial }: { initial: Site }) {
  const [form, setForm] = useState<Site>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string>("")

  const canSave = useMemo(() => {
    return Boolean(form.name.trim() && form.email.trim())
  }, [form.name, form.email])

  async function onSave() {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            key: "site",
            content: form,
        }),
        })


      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Save failed")
      }

      setMessage("Saved")
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Admin Site</h1>
      <p className="mt-2 text-sm text-slate-600">
        Edit global site settings. Saves to GitHub as JSON.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Name
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={form.name}
              onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
              placeholder="Eric Martins"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={form.email}
                onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                placeholder="ericmartins81@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Location
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={form.location}
                onChange={e => setForm(s => ({ ...s, location: e.target.value }))}
                placeholder="Quebec, Canada"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                GitHub URL
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={form.socials?.github ?? ""}
                onChange={e =>
                  setForm(s => ({
                    ...s,
                    socials: { ...(s.socials ?? {}), github: e.target.value },
                  }))
                }
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                LinkedIn URL
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={form.socials?.linkedin ?? ""}
                onChange={e =>
                  setForm(s => ({
                    ...s,
                    socials: { ...(s.socials ?? {}), linkedin: e.target.value },
                  }))
                }
                placeholder="https://www.linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onSave}
              disabled={!canSave || saving}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                !canSave || saving
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-700"
              }`}
            >
              {saving ? "Saving" : "Save"}
            </button>

            <span className="text-sm text-slate-600">{message}</span>
          </div>
        </div>
      </section>
    </main>
  )
}
