"use client"

import { useEffect, useMemo, useState } from "react"
import type { ResumeContent } from "@/types/resume"
import { uploadAsset } from "./uploadAsset"
import { saveContent } from "./saveContent"

function getVersionFromUrl(url: string) {
  try {
    const u = new URL(url)
    return u.searchParams.get("v") || ""
  } catch {
    return ""
  }
}

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

  const initialVersion = useMemo(() => {
    const url = (initial?.resumeUrl || "").trim()
    return url ? getVersionFromUrl(url) : ""
  }, [initial])

  const [viewerVersion, setViewerVersion] = useState(initialVersion)

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string>("")
  const [kept, setKept] = useState(false)

  useEffect(() => {
    if (!resumeFile) {
      setResumePreviewUrl("")
      setKept(false)
      return
    }
    const url = URL.createObjectURL(resumeFile)
    setResumePreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [resumeFile])

  async function onKeep() {
    if (!resumeFile) return

    setSaving(true)
    setMsg("")
    try {
      const out = await uploadAsset({
        path: "data/assets/resume.pdf",
        file: resumeFile,
        message: "Update resume pdf",
      })

      const resumeUrl = `${out.url}?v=${encodeURIComponent(out.sha)}`
      const next: ResumeContent = { resumeUrl }

      await saveContent("resume", next)

      setForm(next)
      setViewerVersion(out.sha)
      setKept(true)
      setMsg("Saved")
      onUpdate?.(next)
    } catch (e: any) {
      setMsg(e?.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function onCancel() {
    setResumeFile(null)
    setMsg("")
  }

  const hasSavedResume = Boolean((form.resumeUrl || "").trim())
  const savedIframeSrc = hasSavedResume
    ? `/resume/view?v=${encodeURIComponent(viewerVersion || "0")}`
    : ""
  const showingPreview = Boolean(resumeFile && resumePreviewUrl)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Resume</h2>
      <p className="mt-1 text-sm text-slate-600">Choose a PDF. Preview it. Keep to publish.</p>

      <div className="mt-6 grid gap-6">
        <section className="grid gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Upload</h3>

          <div className="flex flex-wrap items-center gap-3">
            <input
              id="resumeUpload"
              type="file"
              accept="application/pdf"
              disabled={saving}
              onChange={e => {
                const f = e.target.files?.[0] || null
                setResumeFile(f)
                setKept(false)
                e.currentTarget.value = ""
                setMsg("")
              }}
              className="hidden"
            />

            <label
              htmlFor="resumeUpload"
              className={[
                "inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50",
                saving ? "pointer-events-none opacity-50" : "",
              ].join(" ")}
            >
              Choose file
            </label>

            {resumeFile && !kept ? (
              <>
                <button
                  type="button"
                  onClick={() => void onKeep()}
                  disabled={saving}
                  className={[
                    "rounded-xl px-3 py-2 text-sm font-semibold transition",
                    saving
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-700",
                  ].join(" ")}
                >
                  Keep
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  disabled={saving}
                  className={[
                    "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50",
                    saving ? "pointer-events-none opacity-50" : "",
                  ].join(" ")}
                >
                  Cancel
                </button>

                <span className="text-xs text-slate-600">Selected. Preview below.</span>
              </>
            ) : resumeFile && kept ? (
              <span className="text-xs text-slate-600">Saved.</span>
            ) : (
              <span className="text-xs text-slate-600">No pending change.</span>
            )}
          </div>

          <div className="text-sm text-slate-600">{saving ? "Saving..." : msg}</div>
        </section>

        <section className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-3 text-sm text-slate-600">
            {showingPreview ? "Preview" : hasSavedResume ? "Published resume" : "No resume uploaded"}
          </div>

          {showingPreview ? (
            <iframe
              src={resumePreviewUrl}
              title="Resume preview"
              className="w-full h-[75vh] min-h-[520px]"
            />
          ) : hasSavedResume ? (
            <iframe
              key={viewerVersion || "0"}
              src={savedIframeSrc}
              title="Resume PDF"
              className="w-full h-[75vh] min-h-[520px]"
            />
          ) : null}
        </section>
      </div>
    </div>
  )
}
