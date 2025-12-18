"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") ?? "/admin"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    setLoading(false)

    if (!r.ok) {
      setError("Wrong password")
      return
    }

    router.push(next)
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold">Admin login</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            autoFocus
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Signing in" : "Sign in"}
        </button>
      </form>
    </main>
  )
}
