import Link from "next/link"
import type { Metadata } from "next"
import EmailButtons from "@/components/EmailButtons"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Eric Martins for roles and projects.",
}

const email = "ericmartins81@gmail.com"
const location = "Québec, Canada"

export default function ContactPage() {


  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact</h1>
        <p className="text-slate-600 max-w-2xl">
          Reach out for roles, freelance work, or collaboration.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Email</h2>
          <p className="mt-2 text-slate-600">
            Best way to reach me. I usually reply within 1 to 2 business days.
          </p>

          <EmailButtons />

          <p className="mt-4 text-sm text-slate-600 break-all">{email}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Details</h2>

          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <div>
              <p className="font-medium">Location</p>
              <p className="text-slate-600">{location}</p>
            </div>

            <div>
              <p className="font-medium">Resume</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Link
                  href="/resume"
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
                >
                  View resume
                </Link>
                <a
                  href="/resume/download"
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Download PDF
                </a>
              </div>
            </div>

            <div>
              <p className="font-medium">Projects</p>
              <Link
                href="/projects"
                className="mt-2 inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
              >
                View projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
