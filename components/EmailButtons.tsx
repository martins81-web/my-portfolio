"use client"

import { useState } from "react"

const email = "ericmartins81@gmail.com"

export default function EmailButtons() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-white text-sm font-medium hover:bg-slate-700 transition"
      >
        Email me
      </a>

      <button
        type="button"
        onClick={copyEmail}
        className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
      >
        {copied ? "Copied" : "Copy email"}
      </button>
    </div>
  )
}
