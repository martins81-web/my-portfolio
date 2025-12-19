"use client"

import { useMemo, useState } from "react"
import type { AboutContent } from "@/types/about"
import { saveContent } from "./saveContent"
import { uploadAsset } from "./uploadAsset"

function safeJson(value: any) {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return "[]"
  }
}

function parseArray<T>(text: string): { ok: true; value: T[] } | { ok: false; error: string } {
  try {
    const v = JSON.parse(text)
    if (!Array.isArray(v)) return { ok: false, error: "JSON must be an array" }
    return { ok: true, value: v as T[] }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Invalid JSON" }
  }
}

export default function AboutForm({ initial }: { initial: AboutContent }) {
  const [form, setForm] = useState<AboutContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [jsonError, setJsonError] = useState("")

  const [proofText, setProofText] = useState(() => safeJson(initial.aboutProof || []))
  const [timelineText, setTimelineText] = useState(() => safeJson(initial.aboutTimeline || []))
  const [skillsText, setSkillsText] = useState(() => safeJson(initial.aboutSkills || []))

  const canSave = useMemo(() => Boolean(form.aboutProfile?.name?.trim() && form.aboutProfile?.email?.trim()), [form])

  function applyJsonFields(): AboutContent | null {
    setJsonError("")

    const proofParsed = parseArray<{ label: string; value: string }>(proofText)
    if (!proofParsed.ok) {
      setJsonError(`aboutProof: ${proofParsed.error}`)
      return null
    }

    const timelineParsed = parseArray<{
      period: string
      title: string
      org: string
      bullets: string[]
    }>(timelineText)
    if (!timelineParsed.ok) {
      setJsonError(`aboutTimeline: ${timelineParsed.error}`)
      return null
    }

    const skillsParsed = parseArray<{ title: string; items: string[] }>(skillsText)
    if (!skillsParsed.ok) {
      setJsonError(`aboutSkills: ${skillsParsed.error}`)
      return null
    }

    return {
      ...form,
      aboutProof: proofParsed.value,
      aboutTimeline: timelineParsed.value,
      aboutSkills: skillsParsed.value,
    }
  }

  async function onSave() {
    const next = applyJsonFields()
    if (!next) return

    setSaving(true)
    setMsg("")
    try {
      await saveContent("about", next)
      setForm(next)
      setMsg("Saved")
    } catch (e: any) {
      setMsg(e?.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function onUploadAvatar(file: File) {
    setSaving(true)
    setMsg("")
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
      const out = await uploadAsset({
        path: `data/assets/profile.${ext}`,
        file,
        message: "Update profile picture",
      })

      const next: AboutContent = {
        ...form,
        aboutProfile: { ...form.aboutProfile, avatarUrl: out.url },
      }

      await saveContent("about", next)
      setForm(next)
      setMsg("Saved")
    } catch (e: any) {
      setMsg(e?.message || "Upload failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button disabled={!canSave || saving} onClick={() => void onSave()}>
          Save
        </button>
        <div style={{ opacity: 0.85 }}>{saving ? "Saving..." : msg}</div>
        {jsonError ? <div style={{ color: "crimson" }}>{jsonError}</div> : null}
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ minWidth: 320, flex: 1 }}>
          <h3 style={{ margin: 0 }}>About meta</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            <label>
              Title
              <input
                style={{ display: "block", width: "100%" }}
                value={form.aboutMeta.title}
                onChange={(e) => setForm({ ...form, aboutMeta: { ...form.aboutMeta, title: e.target.value } })}
              />
            </label>

            <label>
              Description
              <textarea
                style={{ display: "block", width: "100%", minHeight: 80 }}
                value={form.aboutMeta.description}
                onChange={(e) =>
                  setForm({ ...form, aboutMeta: { ...form.aboutMeta, description: e.target.value } })
                }
              />
            </label>
          </div>
        </div>

        <div style={{ minWidth: 320, flex: 1 }}>
          <h3 style={{ margin: 0 }}>Profile</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            <label>
              Name
              <input
                style={{ display: "block", width: "100%" }}
                value={form.aboutProfile.name}
                onChange={(e) => setForm({ ...form, aboutProfile: { ...form.aboutProfile, name: e.target.value } })}
              />
            </label>

            <label>
              Headline
              <input
                style={{ display: "block", width: "100%" }}
                value={form.aboutProfile.headline}
                onChange={(e) =>
                  setForm({ ...form, aboutProfile: { ...form.aboutProfile, headline: e.target.value } })
                }
              />
            </label>

            <label>
              Location
              <input
                style={{ display: "block", width: "100%" }}
                value={form.aboutProfile.location}
                onChange={(e) =>
                  setForm({ ...form, aboutProfile: { ...form.aboutProfile, location: e.target.value } })
                }
              />
            </label>

            <label>
              Email
              <input
                style={{ display: "block", width: "100%" }}
                value={form.aboutProfile.email}
                onChange={(e) =>
                  setForm({ ...form, aboutProfile: { ...form.aboutProfile, email: e.target.value } })
                }
              />
            </label>

            <label>
              Summary
              <textarea
                style={{ display: "block", width: "100%", minHeight: 120 }}
                value={form.aboutProfile.summary}
                onChange={(e) =>
                  setForm({ ...form, aboutProfile: { ...form.aboutProfile, summary: e.target.value } })
                }
              />
            </label>

            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 6 }}>Profile picture</div>

              {form.aboutProfile.avatarUrl ? (
                <img
                  src={form.aboutProfile.avatarUrl}
                  alt="Profile"
                  style={{
                    width: 96,
                    height: 96,
                    objectFit: "cover",
                    borderRadius: 12,
                    display: "block",
                    marginBottom: 8,
                  }}
                />
              ) : (
                <div style={{ opacity: 0.8, marginBottom: 8 }}>No profile picture uploaded</div>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={saving}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void onUploadAvatar(f)
                  e.currentTarget.value = ""
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ minWidth: 320, flex: 1 }}>
          <h3 style={{ margin: 0 }}>Proof</h3>
          <textarea
            style={{ display: "block", width: "100%", minHeight: 200, fontFamily: "monospace", marginTop: 10 }}
            value={proofText}
            onChange={(e) => setProofText(e.target.value)}
          />
        </div>

        <div style={{ minWidth: 320, flex: 1 }}>
          <h3 style={{ margin: 0 }}>Timeline</h3>
          <textarea
            style={{ display: "block", width: "100%", minHeight: 200, fontFamily: "monospace", marginTop: 10 }}
            value={timelineText}
            onChange={(e) => setTimelineText(e.target.value)}
          />
        </div>

        <div style={{ minWidth: 320, flex: 1 }}>
          <h3 style={{ margin: 0 }}>Skills</h3>
          <textarea
            style={{ display: "block", width: "100%", minHeight: 200, fontFamily: "monospace", marginTop: 10 }}
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
