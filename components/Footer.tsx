import Link from "next/link"
import { navLinks } from "../data/navigation"
import { contactEmail, contactLinks } from "../data/contact"

const social = contactLinks.filter(l => l.href.startsWith("http"))

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-slate-900">Eric Martins</p>
            <p className="mt-2 text-sm text-slate-600">
              Front End and API Developer
            </p>
            <a
              className="mt-3 inline-block text-sm font-medium text-slate-900 hover:underline"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Pages</p>
            <ul className="mt-3 space-y-2">
              {navLinks.map(l => (
                <li key={l.href}>
                  <Link
                    className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
                    href={l.href}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Social</p>
            <ul className="mt-3 space-y-2">
              {social.map(l => (
                <li key={l.label}>
                  <a
                    className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {social.length === 0 ? (
                <li className="text-sm text-slate-600">Add links in data/contact.ts</li>
              ) : null}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Quick actions</p>
            <div className="mt-3 flex flex-col gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
              >
                View projects
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-600">
            © {year} Eric Martins. All rights reserved.
          </p>
          <p className="text-sm text-slate-600">
            Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
