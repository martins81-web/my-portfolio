// app/api/asset/resume/route.ts
import { NextResponse } from "next/server"
import { fetchGithubFile } from "@/lib/githubFile"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const bytes = await fetchGithubFile("public/Eric_Martins_CV.pdf")

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Not found"
    return NextResponse.json({ ok: false, error: msg }, { status: 404 })
  }
}
