"use client"

import { useMemo, useState, useEffect, useRef, type FormEvent } from "react"
import Image from "next/image"
import type { AboutContent } from "@/types/about"
import { saveContent } from "./saveContent"
import { uploadAsset } from "./uploadAsset"

// Attach a pageshow listener at module initialization so it runs early and catches bfcache restores
if (typeof window !== "undefined" && !(window as any).__aboutFormPageshowListenerAdded) {
  window.addEventListener("pageshow", (e: PageTransitionEvent) => {
    if (e.persisted) window.location.reload()
  })
  ;(window as any).__aboutFormPageshowListenerAdded = true
}



export default function AboutForm({ initial }: { initial: AboutContent }) {
  const [form, setFormState] = useState<AboutContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const [proof, setProof] = useState(() => initial.aboutProof ?? [{ label: "", value: "" }])
  const [timeline, setTimeline] = useState(() => initial.aboutTimeline ?? [{ period: "", title: "", org: "", bullets: [] }])
  const [skills, setSkills] = useState(() => initial.aboutSkills ?? [{ title: "", items: [] }])

  // local preview state when user chooses a new avatar file but hasn't kept it yet
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [avatarVersion, setAvatarVersion] = useState(0)
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number | null>(() => {
    try {
      const v = typeof window !== "undefined" ? window.localStorage.getItem("about.avatarUpdatedAt") : null
      return v ? Number(v) : null
    } catch (e) {
      return null
    }
  })

  // Initialize preview src from localStorage timestamp (avoids flashing the old image on Back / bfcache)
  const [avatarPreviewSrc, setAvatarPreviewSrc] = useState<string | null>(() => {
    try {
      if (typeof window === "undefined") return null
      // prefer an explicitly-stored preview URL (set at upload time)
      const storedPreview = window.localStorage.getItem("about.avatarPreviewUrl")
      if (storedPreview) return storedPreview
      const v = window.localStorage.getItem("about.avatarUpdatedAt")
      const ts = v ? Number(v) : null
      const url = initial.aboutProfile?.avatarUrl
      if (ts && url) {
        return `${url}${url.includes("?") ? "&" : "?"}t=${ts}`
      }
      return null
    } catch (e) {
      return null
    }
  })

  // BroadcastChannel for cross-tab sync (modern browsers)
  const bcRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const bc = new BroadcastChannel("about-avatar")
      bcRef.current = bc
      return () => {
        try {
          bc.close()
        } catch (e) {
          /* ignore */
        }
      }
    } catch (e) {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Listen for storage updates (other tabs) and visibility/focus/pageshow so we can
  // refresh the avatar immediately when another tab or the public page updates it.
  useEffect(() => {
    function updateFromStorage() {
      try {
        const v = window.localStorage.getItem("about.avatarUpdatedAt")
        const n = v ? Number(v) : null
        if (n && n !== lastAvatarUpdate) {
          setLastAvatarUpdate(n)
          // if not currently previewing a selected file, prefer a stored preview URL
          if (!selectedFile) {
            const storedPreview = window.localStorage.getItem("about.avatarPreviewUrl")
            if (storedPreview) {
              setAvatarPreviewSrc(storedPreview)
              console.debug("AboutForm: avatar preview updated from storage", storedPreview)
            } else if (form.aboutProfile?.avatarUrl) {
              const url = form.aboutProfile.avatarUrl
              setAvatarPreviewSrc(`${url}${url.includes("?") ? "&" : "?"}t=${n}`)
              console.debug("AboutForm: avatar updated from storage", n)
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }

    function onStorage(e: StorageEvent) {
      if (e.key === "about.avatarUpdatedAt") {
        updateFromStorage()
        // also explicitly fetch latest content in case localStorage change didn't contain full data
        void fetchLatestAbout()
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        updateFromStorage()
        void fetchLatestAbout()
      }
    }

    function onFocus() {
      updateFromStorage()
      void fetchLatestAbout()
    }

    function onMessage(ev: MessageEvent) {
      if (ev?.data?.updatedAt) updateFromStorage()
    }

    window.addEventListener("storage", onStorage)
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("focus", onFocus)

    // BroadcastChannel listener
    try {
      bcRef.current?.addEventListener("message", onMessage)
    } catch (e) {
      // ignore
    }

    // also check now in case the value was set while we were away
    updateFromStorage()

    return () => {
      window.removeEventListener("storage", onStorage)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("focus", onFocus)
      try {
        bcRef.current?.removeEventListener("message", onMessage)
      } catch (e) {
        // ignore
      }
    }
  }, [lastAvatarUpdate, selectedFile, form.aboutProfile?.avatarUrl])

  // When the saved avatar URL changes on the form (for example after a reload),
  // bump the version to ensure the image reloads. If we're showing a local
  // avatarPreviewSrc (just uploaded), don't stomp it here.
  useEffect(() => {
    if (!avatarPreviewSrc) setAvatarVersion((v) => v + 1)
  }, [form.aboutProfile?.avatarUrl])

  // Ensure we set a cache-busted avatar src on mount and when the saved URL
  // changes. We prefer a local preview or selected file if present. If we
  // already initialized the preview from localStorage (most likely because a
  // recent upload occurred), don't overwrite it to avoid flashing the old image.
  useEffect(() => {
    if (selectedFile) return
    // if we already have a preview (e.g. from localStorage), keep it
    if (avatarPreviewSrc) return

    const url = form.aboutProfile?.avatarUrl
    if (!url) {
      setAvatarPreviewSrc(null);
      return
    }

    const src = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`
    setAvatarPreviewSrc(src)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.aboutProfile?.avatarUrl, selectedFile, avatarPreviewSrc])

  // When the browser restores the page from bfcache (pageshow persisted),
  // re-set avatarSrc so the image is re-fetched from the network.
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        // bfcache restored — fetch latest about.json and update if needed
        void fetchLatestAbout()
      }
    }

    window.addEventListener("pageshow", onPageShow as EventListener)
    return () => window.removeEventListener("pageshow", onPageShow as EventListener)
  }, [form.aboutProfile?.avatarUrl, selectedFile])

  async function fetchLatestAbout() {
    const extractTs = (url: string | undefined | null): number => {
      if (!url) return 0
      try {
        const u = new URL(url)
        const t = u.searchParams.get("t") || u.searchParams.get("v")
        return t ? Number(t) : 0
      } catch (e) {
        return 0
      }
    }

    try {
      console.debug("AboutForm: fetching /api/admin/content?key=about")
      const res = await fetch("/api/admin/content?key=about", { cache: "no-store" })
      const json = await res.json()
      console.debug("AboutForm: fetch result", json)
      if (!json?.ok || !json?.data) return
      const latest = json.data as unknown as AboutContent
      const latestUrl = latest.aboutProfile?.avatarUrl
      const currentUrl = form.aboutProfile?.avatarUrl

      const remoteTs = extractTs(latestUrl)
      // If we have a local, newer timestamp (from a recent upload), do NOT overwrite with older remote data
      if (lastAvatarUpdate) {
        if (remoteTs && remoteTs < lastAvatarUpdate) {
          console.debug("AboutForm: fetchLatestAbout skipped older remote avatar", { remoteTs, lastAvatarUpdate })
          return
        }
        if (!remoteTs) {
          console.debug("AboutForm: fetchLatestAbout skipped remote avatar with no timestamp", { lastAvatarUpdate })
          return
        }
      }

      if (latestUrl && latestUrl !== currentUrl && !selectedFile) {
        // update form and avatarSrc immediately
        setFormState((f) => ({ ...f, aboutProfile: { ...f.aboutProfile, avatarUrl: latestUrl } }))
        const ts = Date.now()
        const src = `${latestUrl}${latestUrl.includes("?") ? "&" : "?"}t=${ts}`
        setAvatarPreviewSrc(src);
        try {
          window.localStorage.setItem("about.avatarUpdatedAt", String(ts))
        } catch (e) {
          // ignore
        }
        setLastAvatarUpdate(ts)
        console.debug("AboutForm: fetchLatestAbout updated avatar", latestUrl)
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e)
      console.debug("AboutForm: fetchLatestAbout error", errMsg)
    }
  }

  // run once on mount to ensure we sync with remote content when the tab mounts
  useEffect(() => {
    void fetchLatestAbout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSave = useMemo(() => Boolean(form.aboutProfile?.name?.trim() && form.aboutProfile?.email?.trim()), [form])

  function applyJsonFields(): AboutContent | null {
    // use the structured state instead of JSON textareas
    return {
      ...form,
      aboutProof: proof,
      aboutTimeline: timeline,
      aboutSkills: skills,
    }
  }

  async function onSave() {
    const next = applyJsonFields()
    if (!next) return

    setSaving(true)
    setMsg("")
    try {
      await saveContent("about", next)
      setFormState(next)
      setMsg("Saved")
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e)
      setMsg(errMsg || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function onUploadAvatar(file: File): Promise<boolean> {
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

      // immediately update local preview and form so the admin reflects the change
      const ts = Date.now()
      const src = `${out.url}${out.url.includes("?") ? "&" : "?"}t=${ts}`
      setAvatarPreviewSrc(src);
      setFormState(() => next)
      try { window.localStorage.setItem("about.avatarUpdatedAt", String(ts)) } catch (e) { /* ignore */ }
      try { window.localStorage.setItem("about.avatarPreviewUrl", src) } catch (e) { /* ignore */ }
      setLastAvatarUpdate(ts)
      try { bcRef.current?.postMessage({ updatedAt: ts, previewUrl: src }) } catch (e) { /* ignore */ }
      setMsg("Saved (pending propagation)")

      // verify the updated about.json reflects the new avatar URL (retry a few times)
      const maxAttempts = 6
      let ok = false
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await fetch("/api/admin/content?key=about", { cache: "no-store" })
          const json = await res.json().catch(() => null)
          if (json?.ok && json?.data?.aboutProfile?.avatarUrl && json.data.aboutProfile.avatarUrl.includes(out.url.split("?")[0])) {
            ok = true
            break
          }
        } catch (e) {
          /* ignore */
        }
        // wait before retrying
        await new Promise((r) => setTimeout(r, 500 * attempt))
      }

      if (!ok) {
        setMsg("Saved asset but content still shows the old image — retrying in background")
        // still set a local preview so user sees the uploaded image immediately
        setAvatarPreviewSrc(src);
        try { window.localStorage.setItem("about.avatarPreviewUrl", src) } catch (e) { /* ignore */ }
        // do not overwrite form until verification succeeds; background retry will update the form when committed
        // schedule a background check to keep trying for a short while
        (async function backgroundRetry() {
          for (let i = 0; i < 10; i++) {
            try {
              const res = await fetch("/api/admin/content?key=about", { cache: "no-store" })
              const json = await res.json().catch(() => null)
              if (json?.ok && json?.data?.aboutProfile?.avatarUrl && json.data.aboutProfile.avatarUrl.includes(out.url.split("?")[0])) {
                const ts2 = Date.now()
                const src2 = `${out.url}${out.url.includes("?") ? "&" : "?"}t=${ts2}`
                setAvatarPreviewSrc(src2);
                try { window.localStorage.setItem("about.avatarPreviewUrl", src2) } catch (e) { /* ignore */ }
                try { window.localStorage.setItem("about.avatarUpdatedAt", String(ts2)) } catch (e) { /* ignore */ }
                try { bcRef.current?.postMessage({ updatedAt: ts2, previewUrl: src2 }) } catch (e) { /* ignore */ }
                setLastAvatarUpdate(ts2)
                setFormState(() => next)
                setMsg("Saved")
                console.debug("AboutForm: background retry succeeded")
                return
              }
            } catch (e) {
              /* ignore */
            }
            await new Promise((r) => setTimeout(r, 1000))
          }
          console.debug("AboutForm: background retry exhausted")
        })()

        return true
      }

      // saved and verified
      setFormState(() => next)
      setAvatarPreviewSrc(src);
      try { window.localStorage.setItem("about.avatarPreviewUrl", src) } catch (e) { /* ignore */ }
      setAvatarVersion((v) => v + 1)
      // persist timestamp so other pages/tabs (or a bfcache restore) can detect the update
      try {
        window.localStorage.setItem("about.avatarUpdatedAt", String(ts))
      } catch (e) {
        /* ignore */
      }
      setLastAvatarUpdate(ts)

      // notify other tabs via BroadcastChannel if available
      try {
        bcRef.current?.postMessage({ updatedAt: ts, previewUrl: src })
      } catch (e) {
        /* ignore */
      }

      setMsg("Saved")
      return true
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e)
      setMsg(errMsg || "Upload failed")
      return false
    } finally {
      setSaving(false)
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    void onSave()
  }

  // If the browser restores the page from bfcache (e.g. Chrome back/forward), reload to get fresh content
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        // reload the page to ensure server state (and images) are fresh
        window.location.reload()
      }
    }

    function onPopState() {
      // on some browsers popstate signifies a back navigation that may restore cache — reload to be safe
      window.location.reload()
    }

    window.addEventListener("pageshow", onPageShow as EventListener)
    window.addEventListener("popstate", onPopState)

    return () => {
      window.removeEventListener("pageshow", onPageShow as EventListener)
      window.removeEventListener("popstate", onPopState)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="submit"
          disabled={!canSave || saving}
          className={[
            "rounded-xl px-4 py-2 text-sm font-semibold transition",
            !canSave || saving ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-700",
          ].join(" ")}
        >
          {saving ? "Saving" : "Save"}
        </button>

        <div className="text-sm text-slate-600">{saving ? "Saving..." : msg}</div>
      </div>

      <div className="flex gap-6 flex-wrap">
        <div className="min-w-0 flex-1">
          <h3 className="m-0">Profile</h3>
          <div className="flex flex-col gap-2 mt-2">
            <label>
              Name
              <input
                name="aboutProfile_name"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutProfile.name}
                onChange={(e) => setFormState({ ...form, aboutProfile: { ...form.aboutProfile, name: e.target.value } })}
              />
            </label>

            <label>
              Headline
              <input
                name="aboutProfile_headline"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutProfile.headline}
                onChange={(e) =>
                  setFormState({ ...form, aboutProfile: { ...form.aboutProfile, headline: e.target.value } })
                }
              />
            </label>

            <label>
              Location
              <input
                name="aboutProfile_location"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutProfile.location}
                onChange={(e) =>
                  setFormState({ ...form, aboutProfile: { ...form.aboutProfile, location: e.target.value } })
                }
              />
            </label>

            <label>
              Email
              <input
                name="aboutProfile_email"
                type="email"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.aboutProfile.email}
                onChange={(e) =>
                  setFormState({ ...form, aboutProfile: { ...form.aboutProfile, email: e.target.value } })
                }
              />
            </label>

            <label>
              Summary
              <textarea
                name="aboutProfile_summary"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm min-h-[120px]"
                value={form.aboutProfile.summary}
                onChange={(e) =>
                  setFormState({ ...form, aboutProfile: { ...form.aboutProfile, summary: e.target.value } })
                }
              />
            </label>

            <div className="mt-4 w-full">
              <div className="mb-2 text-sm font-medium">Profile picture</div>

              <div className="w-full flex flex-col sm:flex-row items-start gap-6 mb-6">
                <div className="flex flex-col gap-3 w-full sm:w-1/2">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-3 mb-0">
                      <input
                        name="aboutProfile_avatar"
                        aria-label="Upload profile picture"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={saving}
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) {
                            if (previewUrl) URL.revokeObjectURL(previewUrl)
                            const u = URL.createObjectURL(f)
                            setSelectedFile(f)
                            setPreviewUrl(u)
                          }
                          e.currentTarget.value = ""
                        }}
                      />

                      <span className={`rounded-xl px-4 py-2 text-sm font-semibold ${saving ? "bg-slate-200 text-slate-500" : "bg-slate-900 text-white hover:bg-slate-700"} focus:outline-none focus:ring-2 focus:ring-slate-200`}>
                        Choose file
                      </span>
                    </label>

                    {selectedFile && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={saving}
                          className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700"
                          onClick={async () => {
                            if (!selectedFile) return
                            const ok = await onUploadAvatar(selectedFile)
                            if (ok) {
                              if (previewUrl) URL.revokeObjectURL(previewUrl)
                              setSelectedFile(null)
                              setPreviewUrl(null)
                            }
                          }}
                        >
                          Keep
                        </button>

                        <button
                          type="button"
                          className="rounded-xl px-3 py-2 text-sm font-semibold bg-white border border-slate-200"
                          onClick={() => {
                            if (previewUrl) URL.revokeObjectURL(previewUrl)
                            setSelectedFile(null)
                            setPreviewUrl(null)
                            setMsg("")
                            try { window.localStorage.removeItem("about.avatarPreviewUrl") } catch (e) { /* ignore */ }
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-1/2 flex items-center justify-center">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={224}
                      height={224}
                      className="w-full max-w-[224px] h-auto object-cover rounded-xl"
                      unoptimized
                    />
                  ) : avatarPreviewSrc ? (
                    <Image
                      src={avatarPreviewSrc}
                      alt="Profile"
                      width={224}
                      height={224}
                      className="w-full max-w-[224px] h-auto object-cover rounded-xl"
                      unoptimized
                    />
                  ) : form.aboutProfile.avatarUrl ? (
                    <Image
                      src={`${form.aboutProfile.avatarUrl}${form.aboutProfile.avatarUrl.includes('?') ? '&' : '?'}v=${avatarVersion}`}
                      alt="Profile"
                      width={224}
                      height={224}
                      className="w-full max-w-[224px] h-auto object-cover rounded-xl"
                      unoptimized
                    />
                  ) : (
                    <div className="opacity-80">No profile picture uploaded</div>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <section className="rounded-xl border border-slate-100 p-4 w-full min-w-0">
          <h3 className="m-0">Proof</h3>
          <div className="mt-3 grid gap-3">
            {proof.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  name={`aboutProof_${i}_label`}
                  className="w-1/3 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={p.label}
                  onChange={(e) => {
                    const next = [...proof]
                    next[i] = { ...next[i], label: e.target.value }
                    setProof(next)
                  }}
                  placeholder="Label"
                />

                <input
                  name={`aboutProof_${i}_value`}
                  className="flex-1 min-w-0 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={p.value}
                  onChange={(e) => {
                    const next = [...proof]
                    next[i] = { ...next[i], value: e.target.value }
                    setProof(next)
                  }}
                  placeholder="Value"
                />

                <button
                  type="button"
                  className="text-xs text-slate-600"
                  onClick={() => setProof(proof.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="w-full text-center rounded-xl px-3 py-2 text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-50 shadow-sm no-underline focus:outline-none focus:ring-2 focus:ring-slate-200"
              onClick={() => setProof([...proof, { label: "", value: "" }])}
            >
              Add proof
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 p-4 w-full min-w-0">
          <h3 className="m-0">Timeline</h3>
          <div className="mt-3 grid gap-3">
            {timeline.map((t, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3">
                <div className="flex gap-2 mb-2 items-center">
                  <input
                    name={`aboutTimeline_${i}_period`}
                    className="w-1/4 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={t.period}
                    onChange={(e) => {
                      const next = [...timeline]
                      next[i] = { ...next[i], period: e.target.value }
                      setTimeline(next)
                    }}
                    placeholder="Period"
                  />

                  <input
                    name={`aboutTimeline_${i}_title`}
                    className="w-1/3 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={t.title}
                    onChange={(e) => {
                      const next = [...timeline]
                      next[i] = { ...next[i], title: e.target.value }
                      setTimeline(next)
                    }}
                    placeholder="Title"
                  />

                  <input
                    name={`aboutTimeline_${i}_org`}
                    className="flex-1 min-w-0 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={t.org}
                    onChange={(e) => {
                      const next = [...timeline]
                      next[i] = { ...next[i], org: e.target.value }
                      setTimeline(next)
                    }}
                    placeholder="Organization"
                  />

                  <button
                    type="button"
                    className="text-xs text-slate-600"
                    onClick={() => setTimeline(timeline.filter((_, j) => j !== i))}
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">Bullets (comma separated)</div>
                  <input
                    name={`aboutTimeline_${i}_bullets`}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={(t.bullets || []).join(", ")}
                    onChange={(e) => {
                      const next = [...timeline]
                      next[i] = { ...next[i], bullets: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }
                      setTimeline(next)
                    }}
                    placeholder="bullet1, bullet2"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="w-full text-center rounded-xl px-3 py-2 text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-50 shadow-sm no-underline focus:outline-none focus:ring-2 focus:ring-slate-200"
              onClick={() => setTimeline([...timeline, { period: "", title: "", org: "", bullets: [] }])}
            >
              Add timeline item
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 p-4 w-full min-w-0">
          <h3 className="m-0">Skills</h3>
          <div className="mt-3 grid gap-3">
            {skills.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  name={`aboutSkills_${i}_title`}
                  className="w-1/3 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={s.title}
                  onChange={(e) => {
                    const next = [...skills]
                    next[i] = { ...next[i], title: e.target.value }
                    setSkills(next)
                  }}
                  placeholder="Title"
                />

                <input
                  name={`aboutSkills_${i}_items`}
                  className="flex-1 min-w-0 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={(s.items || []).join(", ")}
                  onChange={(e) => {
                    const next = [...skills]
                    next[i] = { ...next[i], items: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }
                    setSkills(next)
                  }}
                  placeholder="item1, item2"
                />

                <button
                  type="button"
                  className="text-xs text-slate-600"
                  onClick={() => setSkills(skills.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="w-full text-center rounded-xl px-3 py-2 text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-50 shadow-sm no-underline focus:outline-none focus:ring-2 focus:ring-slate-200"
              onClick={() => setSkills([...skills, { title: "", items: [] }])}
            >
              Add skill group
            </button>
          </div>
        </section>
      </div>
    </form>
  )
}
