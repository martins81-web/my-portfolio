import { NextResponse } from "next/server"

const keyToPath: Record<string, string> = {
  about: "data/content/about.json",
  home: "data/content/home.json",
  projects: "data/content/projects.json",
  seo: "data/content/seo.json",
  site: "data/content/site.json",
}

function requireAuth(req: Request) {
  const cookie = req.headers.get("cookie") ?? ""
  return cookie.split(";").some(p => p.trim() === "admin_auth=1")
}

export async function GET(req: Request) {
  if (!requireAuth(req)) return NextResponse.json({ ok: false }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const key = searchParams.get("key") ?? ""
  const path = keyToPath[key]
  if (!path) return NextResponse.json({ ok: false, error: "Invalid key" }, { status: 400 })

  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? "main"
  const token = process.env.GITHUB_TOKEN
  if (!owner || !repo || !token) {
    return NextResponse.json({ ok: false, error: "Missing GitHub env vars" }, { status: 500 })
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    cache: "no-store",
  })

  if (!r.ok) {
    const err = await r.text()
    return NextResponse.json({ ok: false, error: err }, { status: 500 })
  }

  const json = await r.json()
  const decoded = Buffer.from(json.content, "base64").toString("utf8")
  const content = JSON.parse(decoded)

  return NextResponse.json({ ok: true, path, content })
}

export async function POST(req: Request) {
  if (!requireAuth(req)) return NextResponse.json({ ok: false }, { status: 401 })

  const { key, content, message } = await req.json()
  const path = keyToPath[key]
  if (!path) return NextResponse.json({ ok: false, error: "Invalid key" }, { status: 400 })

  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? "main"
  const token = process.env.GITHUB_TOKEN
  if (!owner || !repo || !token) {
    return NextResponse.json({ ok: false, error: "Missing GitHub env vars" }, { status: 500 })
  }

  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
  const getRes = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  })
  const current = getRes.ok ? await getRes.json() : null
  const sha = current?.sha

  const contentBase64 = Buffer.from(JSON.stringify(content, null, 2)).toString("base64")

  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify({
      message: message ?? `Update ${key}`,
      content: contentBase64,
      sha,
      branch,
    }),
  })

  if (!putRes.ok) {
    const err = await putRes.text()
    return NextResponse.json({ ok: false, error: err }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
