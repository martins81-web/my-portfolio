import { NextResponse } from "next/server"

export const runtime = "nodejs"

function getGithubConfig() {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? "main"
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo || !token) throw new Error("Missing GitHub env vars")
  return { owner, repo, branch, token }
}

function contentTypeFor(path: string): string {
  const ext = (path.split(".").pop() || "jpg").toLowerCase()
  if (ext === "png") return "image/png"
  if (ext === "webp") return "image/webp"
  return "image/jpeg"
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const pathParam = url.searchParams.get("path") || ""
    const rawUrl = url.searchParams.get("url") || ""

    let path = pathParam
    if (!path && rawUrl) {
      try {
        const u = new URL(rawUrl)
        const parts = u.pathname.split("/").filter(Boolean)
        // raw.githubusercontent.com/{owner}/{repo}/{branch}/{...path}
        path = parts.slice(3).join("/")
      } catch {
        /* ignore */
      }
    }

    if (!path) {
      return NextResponse.json({ ok: false, error: "Missing path" }, { status: 400 })
    }

    const { owner, repo, branch, token } = getGithubConfig()
    const contentsUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`

    const res = await fetch(contentsUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => "")
      return NextResponse.json({ ok: false, error: `GitHub fetch failed ${res.status} ${txt}` }, { status: 502 })
    }

    const json = await res.json()
    const content: string = json?.content
    const encoding: string = json?.encoding
    if (!content || encoding !== "base64") {
      return NextResponse.json({ ok: false, error: "Invalid GitHub contents response" }, { status: 502 })
    }

    const bytes = Buffer.from(content, "base64")
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentTypeFor(path),
        "Cache-Control": "no-store, no-cache, max-age=0",
      },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: msg || "Proxy failed" }, { status: 500 })
  }
}
