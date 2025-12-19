import { NextResponse } from "next/server"

export const runtime = "nodejs"

function getGithubConfig() {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? "main"
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo || !token) throw new Error("Missing GITHUB_OWNER or GITHUB_REPO or GITHUB_TOKEN")
  return { owner, repo, branch, token }
}

async function githubGetSha(params: { owner: string; repo: string; branch: string; token: string; path: string }) {
  const url = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}?ref=${params.branch}`

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${params.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  })

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub GET failed ${res.status}`)

  const json = await res.json()
  return (json && json.sha) || null
}

async function githubPutFile(params: {
  owner: string
  repo: string
  branch: string
  token: string
  path: string
  message: string
  contentBase64: string
  sha?: string | null
}) {
  const url = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`

  const body: any = {
    message: params.message,
    content: params.contentBase64,
    branch: params.branch,
  }

  if (params.sha) body.sha = params.sha

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${params.token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    throw new Error(`GitHub PUT failed ${res.status} ${txt}`)
  }

  return res.json()
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()

    const file = form.get("file")
    const path = String(form.get("path") || "")
    const message = String(form.get("message") || "Update asset")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 })
    }

    if (!path) {
      return NextResponse.json({ ok: false, error: "Missing path" }, { status: 400 })
    }

    const { owner, repo, branch, token } = getGithubConfig()

    const ab = await file.arrayBuffer()
    const contentBase64 = Buffer.from(ab).toString("base64")

    const sha = await githubGetSha({ owner, repo, branch, token, path })

    await githubPutFile({
      owner,
      repo,
      branch,
      token,
      path,
      message,
      contentBase64,
      sha,
    })

    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}?v=${Date.now()}`
    return NextResponse.json({ ok: true, path, url })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Upload failed" }, { status: 500 })
  }
}
