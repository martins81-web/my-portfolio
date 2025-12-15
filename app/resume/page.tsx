import Link from "next/link"

const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Angular",
  "REST APIs",
  "UI Engineering",
]

export default function ResumePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8 grid gap-6 lg:grid-cols-3 lg:items-end">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">Resume</h1>
          <p className="text-slate-600 max-w-2xl">
            View my resume below or download the PDF version.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <a
            href="/Eric_Martins_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-white text-sm font-medium hover:bg-slate-700 transition"
          >
            Download PDF
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
          >
            Contact me
          </Link>
        </div>
      </header>

      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-3">Skills snapshot</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <span
              key={s}
              className="text-xs rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
        <div className="border-b border-slate-200 px-4 py-3 text-sm text-slate-600">
          Eric_Martins_CV.pdf
        </div>

        <iframe
          src="/Eric_Martins_CV.pdf"
          title="Eric Martins Resume"
          className="w-full h-[75vh] min-h-[520px]"
        />
      </section>
    </main>
  )
}
