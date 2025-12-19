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
    } catch (e: any) {
      setMsg(e?.message || "Upload failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 900 }}>
      <div style={{ opacity: 0.85 }}>{saving ? "Saving..." : msg}</div>

      <div>
        <div style={{ marginBottom: 8 }}>Current pdf</div>
        {form.resumeUrl ? (
          <a href={form.resumeUrl} target="_blank" rel="noreferrer">
            Open current resume pdf
          </a>
        ) : (
          <div style={{ opacity: 0.8 }}>No resume uploaded</div>
        )}
      </div>

      <div>
        <div style={{ marginBottom: 8 }}>Upload new pdf</div>
        <input
          type="file"
          accept="application/pdf"
          disabled={saving}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void onUpload(f)
            e.currentTarget.value = ""
          }}
        />
      </div>

      {form.resumeUrl ? <object data={form.resumeUrl} type="application/pdf" width="100%" height="700" /> : null}
    </div>
  )
}
