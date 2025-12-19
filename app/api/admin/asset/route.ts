// app/api/admin/asset/route.ts
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function env(name: string) {
  const v = process.env[name]
  return v && v.trim() ? v.trim() : ""
}

async function getExistingSha(opts: {
  owner: string
  repo: string
  branch: string
  token: string
  path: string
}): Promise<string | null> {
  const url = `https://api.github.com/repos/${opts.owner}/${opts.repo}/contents/${opts.path}?ref=${opts.branch}`
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${opts.token}`,
    },
    cache: "no-store",
  })

  if (res.status === 404) return null
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub sha fetch failed: ${res.status} ${text}`)
  }

  const json = (await res.json()) as { sha?: string }
  return json.sha ?? null
}

export async function POST(req: Request) {
  try {
    const owner = env("GITHUB_OWNER") || env("GITHUB_CONTENT_OWNER")
    const repo = env("GITHUB_REPO") || env("GITHUB_CONTENT_REPO")
    const branch = env("GITHUB_BRANCH") || env("GITHUB_CONTENT_BRANCH") || "main"
    const token = env("GITHUB_TOKEN") || env("GITHUB_CONTENT_TOKEN")

    if (!owner || !repo || !token) {
      return NextResponse.json({ ok: false, error: "Missing GitHub env vars" }, { status: 500 })
    }

    const fd = await req.formData()
    const file = fd.get("file")
    const path = String(fd.get("path") || "")
    const message = String(fd.get("message") || "Update asset")

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 })
    }

    const allowed = new Set(["public/profile.jpg", "public/Eric_Martins_CV.pdf"])
    if (!allowed.has(path)) {
      return NextResponse.json({ ok: false, error: "Path not allowed" }, { status: 400 })
    }

    const ab = await file.arrayBuffer()
    const content = Buffer.from(ab).toString("base64")

    const sha = await getExistingSha({ owner, repo, branch, token, path })

    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    const putRes = await fetch(putUrl, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    })

    if (!putRes.ok) {
      const text = await putRes.text()
      return NextResponse.json({ ok: false, error: text }, { status: 500 })
    }

    return NextResponse.json({ ok: true, path })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
