"use client"

import { useState } from "react"
import { contactEmail, contactLinks } from "../../data/contact"

export default function ContactClient() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact</h1>
        <p className="text-slate-600 max-w-2xl">Best way to reach me is email.</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Email</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{contactEmail}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
          >
            Email me
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
          >
            {copied ? "Copied" : "Copy email"}
          </button>

          {contactLinks
            .filter(l => l.label !== "Email")
            .map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
              >
                {link.label}
              </a>
            ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {contactLinks
            .filter(l => l.description)
            .map(l => (
              <div
                key={`${l.label}-desc`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">{l.label}</p>
                <p className="mt-1 text-sm text-slate-600">{l.description}</p>
              </div>
            ))}
        </div>
      </section>
    </main>
  )
}
