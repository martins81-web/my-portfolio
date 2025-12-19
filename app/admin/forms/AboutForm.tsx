// app/admin/forms/AboutForm.tsx
"use client"

import { useMemo, useRef, useState } from "react"
import type { AboutContent } from "@/types/about"
import { saveContent } from "./saveContent"
import { uploadAsset } from "./uploadAsset"

const emptyProof = () => ({ label: "", value: "" })
const emptyTimeline = () => ({ period: "", title: "", org: "", bullets: [""] })
const emptySkillGroup = () => ({ title: "", items: [""] })

export default function AboutForm({
  initial,
  onUpdate,
}: {
  initial: AboutContent
  onUpdate?: (next: AboutContent) => void
}) {
  const [form, setForm] = useState<AboutContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState("")
  const [avatarBust, setAvatarBust] = useState(() => Date.now())

  const avatarSrc = pendingPreview || `/api/asset/profile?v=${avatarBust}`

  function patch(next: AboutContent) {
    setForm(next)
    onUpdate?.(next)
  }

  const canSave = useMemo(() => {
    return Boolean(form.aboutProfile.name.trim() && form.aboutProfile.email.trim())
  }, [form.aboutProfile.name, form.aboutProfile.email])

  async function onSave() {
    setSaving(true)
    setMsg("")
    try {
      await saveContent("about", form)
      setMsg("Saved")
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function updateProfile<K extends keyof AboutContent["aboutProfile"]>(
    key: K,
    value: AboutContent["aboutProfile"][K]
  ) {
    patch({ ...form, aboutProfile: { ...form.aboutProfile, [key]: value } })
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
        path: "public/profile.jpg",
        message: "Update profile picture",
      })

      setAvatarBust(Date.now())
      cancelPending()
      setUploadMsg("Uploaded")
    } catch (e) {
      setUploadMsg(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  function updateProof(i: number, key: "label" | "value", value: string) {
    patch({
      ...form,
      aboutProof: form.aboutProof.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)),
    })
  }

  function addProof() {
    patch({ ...form, aboutProof: [...form.aboutProof, emptyProof()] })
  }

  function removeProof(i: number) {
    patch({ ...form, aboutProof: form.aboutProof.filter((_, idx) => idx !== i) })
  }

  function updateTimeline(i: number, key: "period" | "title" | "org", value: string) {
    patch({
      ...form,
      aboutTimeline: form.aboutTimeline.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)),
    })
  }

  function updateTimelineBullet(i: number, b: number, value: string) {
    patch({
      ...form,
      aboutTimeline: form.aboutTimeline.map((t, idx) =>
        idx !== i ? t : { ...t, bullets: t.bullets.map((x, bi) => (bi === b ? value : x)) }
      ),
    })
  }

  function addTimeline() {
    patch({ ...form, aboutTimeline: [...form.aboutTimeline, emptyTimeline()] })
  }

  function removeTimeline(i: number) {
    patch({ ...form, aboutTimeline: form.aboutTimeline.filter((_, idx) => idx !== i) })
  }

  function addTimelineBullet(i: number) {
    patch({
      ...form,
      aboutTimeline: form.aboutTimeline.map((t, idx) =>
        idx !== i ? t : { ...t, bullets: [...t.bullets, ""] }
      ),
    })
  }

  function removeTimelineBullet(i: number, b: number) {
    patch({
      ...form,
      aboutTimeline: form.aboutTimeline.map((t, idx) =>
        idx !== i ? t : { ...t, bullets: t.bullets.filter((_, bi) => bi !== b) }
      ),
    })
  }

  function updateSkillGroupTitle(i: number, value: string) {
    patch({
      ...form,
      aboutSkills: form.aboutSkills.map((g, idx) => (idx === i ? { ...g, title: value } : g)),
    })
  }

  function updateSkillItem(i: number, s: number, value: string) {
    patch({
      ...form,
      aboutSkills: form.aboutSkills.map((g, idx) =>
        idx !== i ? g : { ...g, items: g.items.map((x, si) => (si === s ? value : x)) }
      ),
    })
  }

  function addSkillGroup() {
    patch({ ...form, aboutSkills: [...form.aboutSkills, emptySkillGroup()] })
  }

  function removeSkillGroup(i: number) {
    patch({ ...form, aboutSkills: form.aboutSkills.filter((_, idx) => idx !== i) })
  }

  function addSkillItem(i: number) {
    patch({
      ...form,
      aboutSkills: form.aboutSkills.map((g, idx) =>
        idx !== i ? g : { ...g, items: [...g.items, ""] }
      ),
    })
  }

  function removeSkillItem(i: number, s: number) {
    patch({
      ...form,
      aboutSkills: form.aboutSkills.map((g, idx) =>
        idx !== i ? g : { ...g, items: g.items.filter((_, si) => si !== s) }
      ),
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">About</h2>
      <p className="mt-1 text-sm text-slate-600">Profile, proof, timeline, skills.</p>

      <div className="mt-6 grid gap-8">
        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Profile picture</p>
              <p className="mt-1 text-sm text-slate-600">Upload replaces public/profile.jpg.</p>

              <div className="mt-4 flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="about-avatar-file"
                  onChange={e => onPickFile(e.target.files?.[0] || null)}
                />

                <label
                  htmlFor="about-avatar-file"
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
            </div>

            <div className="w-full max-w-[420px]">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  key={avatarSrc}
                  src={avatarSrc}
                  alt={form.aboutProfile.name || "Profile"}
                  className="h-[420px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5">
          <h3 className="text-sm font-semibold text-slate-900">Profile</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutProfile.name}
                onChange={e => updateProfile("name", e.target.value)}
              />
            </Field>

            <Field label="Headline">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutProfile.headline}
                onChange={e => updateProfile("headline", e.target.value)}
              />
            </Field>

            <Field label="Location">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutProfile.location}
                onChange={e => updateProfile("location", e.target.value)}
              />
            </Field>

            <Field label="Email">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutProfile.email}
                onChange={e => updateProfile("email", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Summary">
            <textarea
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              rows={4}
              value={form.aboutProfile.summary}
              onChange={e => updateProfile("summary", e.target.value)}
            />
          </Field>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Proof</h3>
            <button
              type="button"
              onClick={addProof}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Add proof
            </button>
          </div>

          <div className="grid gap-4">
            {form.aboutProof.map((p, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-600">Item {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeProof(i)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Label">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={p.label}
                      onChange={e => updateProof(i, "label", e.target.value)}
                    />
                  </Field>
                  <Field label="Value">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={p.value}
                      onChange={e => updateProof(i, "value", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Timeline</h3>
            <button
              type="button"
              onClick={addTimeline}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Add timeline item
            </button>
          </div>

          <div className="grid gap-4">
            {form.aboutTimeline.map((t, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-600">Item {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeTimeline(i)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Field label="Period">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={t.period}
                      onChange={e => updateTimeline(i, "period", e.target.value)}
                    />
                  </Field>
                  <Field label="Title">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={t.title}
                      onChange={e => updateTimeline(i, "title", e.target.value)}
                    />
                  </Field>
                  <Field label="Org">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={t.org}
                      onChange={e => updateTimeline(i, "org", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-600">Bullets</p>
                    <button
                      type="button"
                      onClick={() => addTimelineBullet(i)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Add bullet
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3">
                    {t.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-3">
                        <input
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                          value={b}
                          onChange={e => updateTimelineBullet(i, bi, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeTimelineBullet(i, bi)}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
            <button
              type="button"
              onClick={addSkillGroup}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Add group
            </button>
          </div>

          <div className="grid gap-4">
            {form.aboutSkills.map((g, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-600">Group {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeSkillGroup(i)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid gap-3">
                  <Field label="Title">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={g.title}
                      onChange={e => updateSkillGroupTitle(i, e.target.value)}
                    />
                  </Field>

                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-600">Items</p>
                    <button
                      type="button"
                      onClick={() => addSkillItem(i)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Add item
                    </button>
                  </div>

                  <div className="grid gap-3">
                    {g.items.map((s, si) => (
                      <div key={si} className="flex gap-3">
                        <input
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                          value={s}
                          onChange={e => updateSkillItem(i, si, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeSkillItem(i, si)}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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
