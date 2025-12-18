"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { navLinks as links } from "../data/navigation"



function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-slate-900">
            Eric Martins
          </Link>

          <ul className="hidden items-center gap-2 md:flex">
            {links.map(link => {
              const active = isActive(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`rounded-md px-3 py-2 text-sm transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 transition"
          >
            Menu
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="md:hidden pb-4"
          >
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <ul className="flex flex-col">
                {links.map(link => {
                  const active = isActive(pathname, link.href)
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 text-sm transition ${
                          active
                            ? "bg-slate-900 text-white"
                            : "text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
