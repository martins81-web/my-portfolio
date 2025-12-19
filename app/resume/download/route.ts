// app/resume/download/route.ts
import { NextResponse } from "next/server"
import { fetchGithubFile } from "@/lib/githubFile"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const bytes = await fetchGithubFile("public/Eric_Martins_CV.pdf")

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Eric_Martins_CV.pdf"',
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
