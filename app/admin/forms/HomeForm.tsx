"use client"

import { useMemo, useState } from "react"
import { saveContent } from "./saveContent"

type HomeJson = {
  homeHero: {
    title: string
    subtitle: string
    description: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
  }
  homeHighlights: Array<{ title: string; description: string }>
  featuredProjectSlugs: string[]
  testimonials: Array<{ name: string; role: string; quote: string }>
}

const emptyHighlight = () => ({ title: "", description: "" })
const emptyTestimonial = () => ({ name: "", role: "", quote: "" })

export default function HomeForm({ initial }: { initial: HomeJson }) {
  const [form, setForm] = useState<HomeJson>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSave = useMemo(() => {
    return Boolean(form.homeHero.title.trim() && form.homeHero.subtitle.trim())
  }, [form.homeHero.title, form.homeHero.subtitle])

  async function onSave() {
    setSaving(true)
    setMsg("")
    try {
      await saveContent("home", form)
      setMsg("Saved")
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function updateHero<K extends keyof HomeJson["homeHero"]>(
    key: K,
    value: HomeJson["homeHero"][K]
  ) {
    setForm(s => ({ ...s, homeHero: { ...s.homeHero, [key]: value } }))
  }

  function updateHeroCta(
    which: "primaryCta" | "secondaryCta",
    key: "label" | "href",
    value: string
  ) {
    setForm(s => ({
      ...s,
      homeHero: {
        ...s.homeHero,
        [which]: {
          ...s.homeHero[which],
          [key]: value,
        },
      },
    }))
  }

  function updateHighlight(i: number, key: "title" | "description", value: string) {
    setForm(s => ({
      ...s,
      homeHighlights: s.homeHighlights.map((h, idx) =>
        idx === i ? { ...h, [key]: value } : h
      ),
    }))
  }

  function addHighlight() {
    setForm(s => ({ ...s, homeHighlights: [...s.homeHighlights, emptyHighlight()] }))
  }

  function removeHighlight(i: number) {
    setForm(s => ({
      ...s,
      homeHighlights: s.homeHighlights.filter((_, idx) => idx !== i),
    }))
  }

  function updateSlug(i: number, value: string) {
    setForm(s => ({
      ...s,
      featuredProjectSlugs: s.featuredProjectSlugs.map((x, idx) => (idx === i ? value : x)),
    }))
  }

  function addSlug() {
    setForm(s => ({ ...s, featuredProjectSlugs: [...s.featuredProjectSlugs, ""] }))
  }

  function removeSlug(i: number) {
    setForm(s => ({
      ...s,
      featuredProjectSlugs: s.featuredProjectSlugs.filter((_, idx) => idx !== i),
    }))
  }

  function updateTestimonial(
    i: number,
    key: "name" | "role" | "quote",
    value: string
  ) {
    setForm(s => ({
      ...s,
      testimonials: s.testimonials.map((t, idx) =>
        idx === i ? { ...t, [key]: value } : t
      ),
    }))
  }

  function addTestimonial() {
    setForm(s => ({ ...s, testimonials: [...s.testimonials, emptyTestimonial()] }))
  }

  function removeTestimonial(i: number) {
    setForm(s => ({
      ...s,
      testimonials: s.testimonials.filter((_, idx) => idx !== i),
    }))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Home</h2>
      <p className="mt-1 text-sm text-slate-600">Homepage content.</p>

      <div className="mt-6 grid gap-8">
        <section className="grid gap-5">
          <h3 className="text-sm font-semibold text-slate-900">Hero</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.homeHero.title}
                onChange={e => updateHero("title", e.target.value)}
              />
            </Field>

            <Field label="Subtitle">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.homeHero.subtitle}
                onChange={e => updateHero("subtitle", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              rows={3}
              value={form.homeHero.description}
              onChange={e => updateHero("description", e.target.value)}
            />
          </Field>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-600">Primary button</p>
              <div className="mt-3 grid gap-3">
                <Field label="Label">
                  <input
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={form.homeHero.primaryCta.label}
                    onChange={e => updateHeroCta("primaryCta", "label", e.target.value)}
                  />
                </Field>
                <Field label="Href">
                  <input
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={form.homeHero.primaryCta.href}
                    onChange={e => updateHeroCta("primaryCta", "href", e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-600">Secondary button</p>
              <div className="mt-3 grid gap-3">
                <Field label="Label">
                  <input
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={form.homeHero.secondaryCta.label}
                    onChange={e => updateHeroCta("secondaryCta", "label", e.target.value)}
                  />
                </Field>
                <Field label="Href">
                  <input
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={form.homeHero.secondaryCta.href}
                    onChange={e => updateHeroCta("secondaryCta", "href", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Highlights</h3>
            <button
              type="button"
              onClick={addHighlight}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Add highlight
            </button>
          </div>

          <div className="grid gap-4">
            {form.homeHighlights.map((h, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-600">Item {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid gap-3">
                  <Field label="Title">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={h.title}
                      onChange={e => updateHighlight(i, "title", e.target.value)}
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      rows={2}
                      value={h.description}
                      onChange={e => updateHighlight(i, "description", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Featured project slugs</h3>
            <button
              type="button"
              onClick={addSlug}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Add slug
            </button>
          </div>

          <div className="grid gap-3">
            {form.featuredProjectSlugs.map((slug, i) => (
              <div key={i} className="flex gap-3">
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={slug}
                  onChange={e => updateSlug(i, e.target.value)}
                  placeholder="react-admin-dashboard"
                />
                <button
                  type="button"
                  onClick={() => removeSlug(i)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Testimonials</h3>
            <button
              type="button"
              onClick={addTestimonial}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Add testimonial
            </button>
          </div>

          <div className="grid gap-4">
            {form.testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-600">Item {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(i)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={t.name}
                      onChange={e => updateTestimonial(i, "name", e.target.value)}
                    />
                  </Field>

                  <Field label="Role">
                    <input
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      value={t.role}
                      onChange={e => updateTestimonial(i, "role", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Quote">
                  <textarea
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    rows={2}
                    value={t.quote}
                    onChange={e => updateTestimonial(i, "quote", e.target.value)}
                  />
                </Field>
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
