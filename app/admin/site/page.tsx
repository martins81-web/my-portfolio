"use client"

import { useEffect, useState } from "react"

export default function AdminSitePage() {
  const [value, setValue] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const r = await fetch("/api/admin/content?key=site", { cache: "no-store" })
      const j = await r.json()
      setValue(JSON.stringify(j.content, null, 2))
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setStatus(null)
    let parsed: any
    try {
      parsed = JSON.parse(value)
    } catch {
      setStatus("Invalid JSON")
      return
    }

    const r = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "site", content: parsed, message: "Update site content" }),
    })

    if (!r.ok) {
      const t = await r.text()
      setStatus(`Save failed: ${t}`)
      return
    }

    setStatus("Saved. A new commit was created.")
  }

  if (loading) return <main className="mx-auto w-full max-w-3xl px-6 py-12">Loading</main>

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Edit site</h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          className="h-[520px] w-full rounded-md border border-slate-300 p-3 font-mono text-sm"
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Save
          </button>
          {status ? <p className="text-sm text-slate-700">{status}</p> : null}
        </div>
      </div>
    </main>
  )
}
