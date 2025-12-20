"use client"

import { useState } from "react"
import type { ResumeContent } from "@/types/resume"
import { uploadAsset } from "./uploadAsset"
import { saveContent } from "./saveContent"

export default function ResumeForm({ initial }: { initial: ResumeContent }) {
  const [form, setForm] = useState<ResumeContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  async function onUpload(file: File) {
    setSaving(true)
    setMsg("")
    try {
      const out = await uploadAsset({
        path: "data/assets/resume.pdf",
        file,
        message: "Update resume pdf",
      })

      const next: ResumeContent = { resumeUrl: out.url }
      await saveContent("resume", next)
      setForm(next)
      setMsg("Saved")
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e)
      setMsg(errMsg || "Upload failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-3xl">
      <div className="mb-4 text-sm text-slate-600">{saving ? "Saving..." : msg}</div>

      <div className="mb-4">
        <div className="mb-2 text-sm font-semibold">Current pdf</div>
        {form.resumeUrl ? (
          <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="text-slate-900 underline">
            Open current resume pdf
          </a>
        ) : (
          <div className="opacity-80">No resume uploaded</div>
        )}
      </div>

      <div className="mb-6">
        <div className="mb-2 text-sm font-semibold">Upload new pdf</div>
        <label className="inline-flex items-center gap-3">
          <input
            type="file"
            accept="application/pdf"
            disabled={saving}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void onUpload(f)
              e.currentTarget.value = ""
            }}
          />

          <span className={`rounded-xl px-4 py-2 text-sm font-semibold ${saving ? "bg-slate-200 text-slate-500" : "bg-slate-900 text-white hover:bg-slate-700"}`}>
            Choose file
          </span>
        </label>
      </div>

      {form.resumeUrl ? <object data={form.resumeUrl} type="application/pdf" width="100%" height="700" /> : null}
    </div>
  )
}
