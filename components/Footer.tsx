import Link from "next/link"
import { getSite } from "@/data/site"

type FooterLink = { label: string; href: string }

export default async function Footer() {
  const site = await getSite()

  const links: FooterLink[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">{site.name}</p>
            <p className="mt-1 text-sm text-slate-600">{site.location}</p>
            <p className="mt-1 text-sm text-slate-600 break-all">{site.email}</p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-slate-700 hover:text-slate-900">
                {l.label}
              </Link>
            ))}
            {site.socials?.github ? (
              <a
                href={site.socials.github}
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-slate-900"
              >
                GitHub
              </a>
            ) : null}
            {site.socials?.linkedin ? (
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-slate-900"
              >
                LinkedIn
              </a>
            ) : null}
          </nav>
        </div>

        <div className="mt-8 text-xs text-slate-500">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
