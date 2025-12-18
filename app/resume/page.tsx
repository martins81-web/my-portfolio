import type { Metadata } from "next"
import { resumePdfPath, resumePage } from "../../data/resume"

export const metadata: Metadata = {
  title: resumePage.title,
  description: resumePage.description,
}

export default function ResumePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{resumePage.title}</h1>
        <p className="text-slate-600 max-w-2xl">{resumePage.description}</p>
      </header>

      <div className="mb-6 flex gap-4 flex-wrap">
        <a
          href={resumePdfPath}
          className="inline-flex items-center rounded-md bg-slate-900 px-5 py-2.5 text-white text-sm font-medium hover:bg-slate-700 transition"
          download
        >
          {resumePage.downloadLabel}
        </a>

        <a
          href="/contact"
          className="inline-flex items-center rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
        >
          {resumePage.contactCtaLabel}
        </a>
      </div>

      <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm bg-white">
        <iframe
          src={resumePdfPath}
          className="w-full h-[900px]"
          title={resumePage.viewerTitle}
        />
      </div>
    </main>
  )
}
