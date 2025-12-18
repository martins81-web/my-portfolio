"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginClient() {
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

  const wrap: React.CSSProperties = { maxWidth: 520, margin: "0 auto", padding: "48px 16px" }
  const card: React.CSSProperties = {
    marginTop: 24,
    border: "1px solid rgba(15,23,42,0.14)",
    borderRadius: 18,
    background: "#fff",
    padding: 20,
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  }
  const label: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 600, color: "rgba(15,23,42,0.85)" }
  const input: React.CSSProperties = {
    marginTop: 10,
    width: "100%",
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,0.18)",
    padding: "10px 12px",
    fontSize: 14,
  }
  const btn: React.CSSProperties = {
    width: "100%",
    marginTop: 14,
    borderRadius: 10,
    border: "none",
    padding: "10px 12px",
    fontSize: 14,
    fontWeight: 600,
    background: "rgb(15,23,42)",
    color: "#fff",
    cursor: "pointer",
    opacity: loading ? 0.7 : 1,
  }

  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Admin login</h1>

      <form onSubmit={onSubmit} style={card}>
        <label style={label}>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={input}
            autoFocus
          />
        </label>

        {error ? <p style={{ marginTop: 12, fontSize: 13, color: "#b91c1c" }}>{error}</p> : null}

        <button type="submit" disabled={loading} style={btn}>
          {loading ? "Signing in" : "Sign in"}
        </button>
      </form>
    </main>
  )
}
