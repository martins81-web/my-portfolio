import type { ReactNode } from "react"

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  )
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
      {children}
    </span>
  )
}

export function ButtonPrimary({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
    >
      {children}
    </a>
  )
}

export function ButtonGhost({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
    >
      {children}
    </a>
  )
}
