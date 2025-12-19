import type { ResumeContent } from "@/types/resume"
import { fetchGithubJson } from "@/lib/content"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type GithubContentsResponse = {
  content: string
  encoding: "base64" | string
}

export async function GET() {
  const owner = process.env.GITHUB_OWNER || process.env.GITHUB_CONTENT_OWNER
  const repo = process.env.GITHUB_REPO || process.env.GITHUB_CONTENT_REPO
  const branch = process.env.GITHUB_BRANCH || process.env.GITHUB_CONTENT_BRANCH || "main"
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_CONTENT_TOKEN

  if (!owner || !repo) return new Response("Missing GitHub env vars", { status: 500 })

  const resume = await fetchGithubJson<ResumeContent>({ path: "data/content/resume.json" })
  const hasResume = Boolean(resume.resumeUrl && resume.resumeUrl.trim())

  if (!hasResume) return new Response("No resume", { status: 404 })

  const assetPath = "data/assets/resume.pdf"
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${assetPath}?ref=${branch}`

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return new Response(`GitHub fetch failed: ${res.status} ${text}`, { status: 502 })
  }

  const json = (await res.json()) as GithubContentsResponse
  if (!json.content) return new Response("Missing content", { status: 502 })

  const buf = Buffer.from(json.content, "base64")

  return new Response(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="resume.pdf"',
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
