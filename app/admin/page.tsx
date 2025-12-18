import Link from "next/link"

const items = [
  { key: "site", label: "Site", href: "/admin/site" },
  { key: "home", label: "Home", href: "/admin/home" },
  { key: "about", label: "About", href: "/admin/about" },
  { key: "projects", label: "Projects", href: "/admin/projects" },
  { key: "seo", label: "SEO", href: "/admin/seo" },
]

export default function AdminIndexPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Admin</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map(i => (
          <Link
            key={i.key}
            href={i.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50"
          >
            <div className="text-sm text-slate-600">Edit</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{i.label}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
