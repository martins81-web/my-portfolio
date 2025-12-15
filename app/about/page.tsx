import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { projects } from "../../data/projects"

export const metadata: Metadata = {
  title: "About",
  description: "About Eric Martins, Front End and API Developer.",
}

const profile = {
  name: "Eric Martins",
  headline: "Front End and API Developer",
  location: "Québec, Canada",
  email: "ericmartins81@gmail.com",
  summary:
    "I build clean UI and reliable integrations with TypeScript, modern frameworks, and APIs. I focus on performance, accessibility, and maintainable code.",
}

const timeline = [
  {
    period: "2025",
    title: "Front End Developer",
    org: "Add company",
    bullets: [
      "Add one measurable achievement",
      "Add one measurable achievement",
      "Add one measurable achievement",
    ],
  },
  {
    period: "2024",
    title: "Front End and API Developer",
    org: "Add company",
    bullets: ["Add one measurable achievement", "Add one measurable achievement"],
  },
  {
    period: "2023",
    title: "Web Developer",
    org: "Add company",
    bullets: ["Add one measurable achievement", "Add one measurable achievement"],
  },
]

const skills = [
  {
    title: "UI",
    items: ["Accessibility", "Responsive UI", "Design systems", "Performance"],
  },
  {
    title: "Frameworks",
    items: ["Next.js", "React", "Angular", "Vue"],
  },
  {
    title: "APIs",
    items: ["REST", "Auth flows", "Error handling", "Data validation"],
  },
  {
    title: "Tools",
    items: ["TypeScript", "Git", "Tailwind CSS", "Testing"],
  },
]

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
      {text}
    </span>
  )
}

export default function AboutPage() {
  const projectCount = projects.length

  const proof = [
    { label: "Projects", value: String(projectCount) },
    { label: "Years experience", value: "Add years" },
    { label: "Industries", value: "Add list" },
    { label: "Clients", value: "Add list" },
  ]

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(900px circle at 20% 10%, rgba(15,23,42,0.08), transparent 60%), radial-gradient(700px circle at 85% 35%, rgba(15,23,42,0.05), transparent 55%)",
          }}
        />

        <div className="relative">
          <p className="text-sm text-slate-600">About</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl">{profile.summary}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
            >
              View projects
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
            >
              View resume
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
            >
              Contact
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge text={profile.headline} />
            <Badge text={profile.location} />
            <Badge text={profile.email} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Photo</h2>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Image
            src="/profile.jpg"
            alt="Eric Martins"
            width={1200}
            height={800}
            className="h-96 w-full object-cover object-top sm:h-[28rem]"
            priority
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {proof.map(item => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs text-slate-600">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Recent experience
            </h2>
            <Link
              href="/resume"
              className="text-sm font-medium text-slate-900 hover:underline"
            >
              Full resume
            </Link>
          </div>

          <div className="mt-6 space-y-6">
            {timeline.map(item => (
              <div
                key={`${item.period}-${item.title}`}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-600">{item.org}</p>
                  </div>
                  <Badge text={item.period} />
                </div>

                <ul className="mt-4 list-disc pl-5 text-sm text-slate-700 space-y-2">
                  {item.bullets.map((b, i) => (
                    <li key={`${item.period}-${item.title}-${i}`}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Skills</h2>

          <div className="mt-6 space-y-6">
            {skills.map(group => (
              <div key={group.title}>
                <p className="text-sm font-semibold text-slate-900">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map(s => (
                    <Badge key={`${group.title}-${s}`} text={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
            >
              Contact
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}
