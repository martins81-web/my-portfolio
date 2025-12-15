export default function ResumePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resume</h1>
        <p className="text-slate-600 max-w-2xl">
          Here is my professional resume. You can view it directly below or
          download the PDF version.
        </p>
      </header>

      {/* Actions */}
      <div className="mb-6 flex gap-4">
        <a
          href="/Eric_Martins_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md bg-slate-900 px-5 py-2.5 text-white text-sm font-medium hover:bg-slate-700 transition"
        >
          Download PDF
        </a>

        <a
          href="/contact"
          className="inline-flex items-center rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
        >
          Contact me
        </a>
      </div>

      {/* Resume Viewer */}
      <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <iframe
          src="/Eric_Martins_CV.pdf"
          className="w-full h-[900px]"
          title="Eric Martins Resume"
        />
      </div>
    </main>
  )
}
