// app/admin/forms/ResumeForm.tsx
"use client"

import { useMemo, useRef, useState } from "react"
import type { ResumeContent } from "@/types/resume"
import { saveContent } from "./saveContent"
import { uploadAsset } from "./uploadAsset"

export default function ResumeForm({
  initial,
  onUpdate,
}: {
  initial: ResumeContent
  onUpdate?: (next: ResumeContent) => void
}) {
  const [form, setForm] = useState<ResumeContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState("")
  const [resumeBust, setResumeBust] = useState(() => Date.now())

  const baseUrl = form.resumeUrl?.trim() ? form.resumeUrl.trim() : "/api/asset/resume"
  const previewSrc = pendingPreview ? pendingPreview : `${baseUrl}?v=${resumeBust}`

  function patch(next: ResumeContent) {
    setForm(next)
    onUpdate?.(next)
  }

  const canSave = useMemo(() => Boolean(baseUrl), [baseUrl])

  async function onSave() {
    setSaving(true)
    setMsg("")
    try {
      await saveContent("resume", form)
      setMsg("Saved")
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function onPickFile(file: File | null) {
    setUploadMsg("")
    if (!file) return
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(file)
    setPendingPreview(URL.createObjectURL(file))
  }

  function cancelPending() {
    setUploadMsg("")
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(null)
    setPendingPreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function keepPending() {
    if (!pendingFile) return
    setUploading(true)
    setUploadMsg("")
    try {
      await uploadAsset({
        file: pendingFile,
        path: "public/Eric_Martins_CV.pdf",
        message: "Update resume pdf",
      })

      if (!form.resumeUrl || form.resumeUrl !== "/api/asset/resume") {
        patch({ ...form, resumeUrl: "/api/asset/resume" })
      }

      setResumeBust(Date.now())
      cancelPending()
      setUploadMsg("Uploaded")
    } catch (e) {
      setUploadMsg(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Resume</h2>
          <p className="mt-1 text-sm text-slate-600">Upload replaces public/Eric_Martins_CV.pdf.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              id="resume-file"
              onChange={e => onPickFile(e.target.files?.[0] || null)}
            />

            <label
              htmlFor="resume-file"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Choose file
            </label>

            {pendingFile ? (
              <>
                <button
                  type="button"
                  onClick={keepPending}
                  disabled={uploading}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-semibold transition",
                    uploading
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-700",
                  ].join(" ")}
                >
                  {uploading ? "Keeping" : "Keep"}
                </button>

                <button
                  type="button"
                  onClick={cancelPending}
                  disabled={uploading}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </>
            ) : null}

            <span className="text-sm text-slate-600">{uploadMsg}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
          <div className="border-b border-slate-200 px-4 py-3 text-sm text-slate-600">
            Preview
          </div>
          <iframe
            key={previewSrc}
            src={previewSrc}
            title="Resume preview"
            className="w-full h-[75vh] min-h-[520px]"
          />
        </section>

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
      </div>
    </div>
  )
}
