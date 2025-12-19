"use client"

import { useMemo, useState } from "react"
import { saveContent } from "./saveContent"

type AboutJson = {
  aboutMeta: {
    title: string
    description: string
  }
  aboutProfile: {
    name: string
    headline: string
    location: string
    email: string
    summary: string
  }
  aboutProof: Array<{ label: string; value: string }>
  aboutTimeline: Array<{
    period: string
    title: string
    org: string
    bullets: string[]
  }>
  aboutSkills: Array<{
    title: string
    items: string[]
  }>
}

const emptyProof = () => ({ label: "", value: "" })
const emptyTimeline = () => ({ period: "", title: "", org: "", bullets: [""] })
const emptySkillGroup = () => ({ title: "", items: [""] })

export default function AboutForm({ initial }: { initial: AboutJson }) {
  const [form, setForm] = useState<AboutJson>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSave = useMemo(() => {
    return Boolean(form.aboutProfile.name.trim() && form.aboutProfile.headline.trim())
  }, [form.aboutProfile.name, form.aboutProfile.headline])

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

  function updateMeta<K extends keyof AboutJson["aboutMeta"]>(
    key: K,
    value: AboutJson["aboutMeta"][K]
  ) {
    setForm(s => ({ ...s, aboutMeta: { ...s.aboutMeta, [key]: value } }))
  }

  function updateProfile<K extends keyof AboutJson["aboutProfile"]>(
    key: K,
    value: AboutJson["aboutProfile"][K]
  ) {
    setForm(s => ({ ...s, aboutProfile: { ...s.aboutProfile, [key]: value } }))
  }

  function updateProof(i: number, key: "label" | "value", value: string) {
    setForm(s => ({
      ...s,
      aboutProof: s.aboutProof.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)),
    }))
  }

  function addProof() {
    setForm(s => ({ ...s, aboutProof: [...s.aboutProof, emptyProof()] }))
  }

  function removeProof(i: number) {
    setForm(s => ({ ...s, aboutProof: s.aboutProof.filter((_, idx) => idx !== i) }))
  }

  function updateTimeline(
    i: number,
    key: "period" | "title" | "org",
    value: string
  ) {
    setForm(s => ({
      ...s,
      aboutTimeline: s.aboutTimeline.map((t, idx) =>
        idx === i ? { ...t, [key]: value } : t
      ),
    }))
  }

  function updateTimelineBullet(i: number, bIndex: number, value: string) {
    setForm(s => ({
      ...s,
      aboutTimeline: s.aboutTimeline.map((t, idx) => {
        if (idx !== i) return t
        return {
          ...t,
          bullets: t.bullets.map((b, bi) => (bi === bIndex ? value : b)),
        }
      }),
    }))
  }

  function addTimeline() {
    setForm(s => ({ ...s, aboutTimeline: [...s.aboutTimeline, emptyTimeline()] }))
  }

  function removeTimeline(i: number) {
    setForm(s => ({
      ...s,
      aboutTimeline: s.aboutTimeline.filter((_, idx) => idx !== i),
    }))
  }

  function addTimelineBullet(i: number) {
    setForm(s => ({
      ...s,
      aboutTimeline: s.aboutTimeline.map((t, idx) =>
        idx === i ? { ...t, bullets: [...t.bullets, ""] } : t
      ),
    }))
  }

  function removeTimelineBullet(i: number, bIndex: number) {
    setForm(s => ({
      ...s,
      aboutTimeline: s.aboutTimeline.map((t, idx) => {
        if (idx !== i) return t
        return { ...t, bullets: t.bullets.filter((_, bi) => bi !== bIndex) }
      }),
    }))
  }

  function updateSkillGroupTitle(i: number, value: string) {
    setForm(s => ({
      ...s,
      aboutSkills: s.aboutSkills.map((g, idx) => (idx === i ? { ...g, title: value } : g)),
    }))
  }

  function updateSkillItem(i: number, itemIndex: number, value: string) {
    setForm(s => ({
      ...s,
      aboutSkills: s.aboutSkills.map((g, idx) => {
        if (idx !== i) return g
        return { ...g, items: g.items.map((it, ii) => (ii === itemIndex ? value : it)) }
      }),
    }))
  }

  function addSkillGroup() {
    setForm(s => ({ ...s, aboutSkills: [...s.aboutSkills, emptySkillGroup()] }))
  }

  function removeSkillGroup(i: number) {
    setForm(s => ({ ...s, aboutSkills: s.aboutSkills.filter((_, idx) => idx !== i) }))
  }

  function addSkillItem(i: number) {
    setForm(s => ({
      ...s,
      aboutSkills: s.aboutSkills.map((g, idx) =>
        idx === i ? { ...g, items: [...g.items, ""] } : g
      ),
    }))
  }

  function removeSkillItem(i: number, itemIndex: number) {
    setForm(s => ({
      ...s,
      aboutSkills: s.aboutSkills.map((g, idx) => {
        if (idx !== i) return g
        return { ...g, items: g.items.filter((_, ii) => ii !== itemIndex) }
      }),
    }))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">About</h2>
      <p className="mt-1 text-sm text-slate-600">About page content.</p>

      <div className="mt-6 grid gap-8">
        <section className="grid gap-5">
          <h3 className="text-sm font-semibold text-slate-900">Meta</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutMeta.title}
                onChange={e => updateMeta("title", e.target.value)}
              />
            </Field>

            <Field label="Description">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutMeta.description}
                onChange={e => updateMeta("description", e.target.value)}
              />
            </Field>
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
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
              rows={3}
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
              Add item
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
              Add entry
            </button>
          </div>

          <div className="grid gap-4">
            {form.aboutTimeline.map((t, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-600">Entry {i + 1}</p>
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
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-slate-600">Bullets</p>
                    <button
                      type="button"
                      onClick={() => addTimelineBullet(i)}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
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

                  <div className="mt-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-slate-600">Items</p>
                      <button
                        type="button"
                        onClick={() => addSkillItem(i)}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                      >
                        Add item
                      </button>
                    </div>

                    <div className="mt-3 grid gap-3">
                      {g.items.map((it, ii) => (
                        <div key={ii} className="flex gap-3">
                          <input
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            value={it}
                            onChange={e => updateSkillItem(i, ii, e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeSkillItem(i, ii)}
                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
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
