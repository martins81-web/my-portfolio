import { NextResponse } from "next/server"

export const runtime = "nodejs"

const ALLOWED_KEYS = ["site", "seo", "home", "about", "projects", "resume"] as const
type ContentKey = (typeof ALLOWED_KEYS)[number]

function getGithubConfig() {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? "main"
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo || !token) throw new Error("Missing GitHub env vars")
  return { owner, repo, branch, token }
}

async function githubGetSha(params: { owner: string; repo: string; branch: string; token: string; path: string }) {
  const url = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}?ref=${params.branch}`

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${params.token}`,
    },
    cache: "no-store",
  })

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub GET failed ${res.status}`)

  type GithubShaResp = { sha?: string }
  const json = (await res.json().catch(() => null)) as GithubShaResp | null
  return json?.sha ?? null
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

  const body: Record<string, unknown> = {
    message: params.message,
    content: params.contentBase64,
    branch: params.branch,
  }

  if (params.sha) (body as Record<string, unknown>).sha = params.sha

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${params.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    throw new Error(`GitHub PUT failed ${res.status} ${txt}`)
  }

  return res.json()
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const key = url.searchParams.get("key") as ContentKey | null

    if (!key || !ALLOWED_KEYS.includes(key)) {
      return NextResponse.json({ ok: false, error: `Invalid key '${key}'` }, { status: 400 })
    }

    const owner = process.env.GITHUB_OWNER
    const repo = process.env.GITHUB_REPO
    const branch = process.env.GITHUB_BRANCH ?? "main"

    if (!owner || !repo) {
      return NextResponse.json({ ok: false, error: "Missing repo config" }, { status: 500 })
    }

    // fetch file via GitHub Contents API (auth) and decode base64 to avoid CDN cache delays
    const { owner: ghOwner, repo: ghRepo, branch: ghBranch, token } = getGithubConfig()
    const contentsUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/data/content/${key}.json?ref=${ghBranch}`

    const res = await fetch(contentsUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => "")
      return NextResponse.json({ ok: false, error: `GitHub contents fetch failed ${res.status} ${txt}` }, { status: 502 })
    }

    const contentsJson = await res.json().catch(() => null)
    if (!contentsJson || typeof contentsJson.content !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid contents response" }, { status: 502 })
    }

    const decoded = Buffer.from(contentsJson.content, contentsJson.encoding === "base64" ? "base64" : "utf8").toString("utf8")
    const json = JSON.parse(decoded)

    return NextResponse.json({ ok: true, data: json })
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: errMsg || "Fetch failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { key, data, message } = (await req.json()) as {
      key?: ContentKey
      data?: unknown
      message?: string
    }

    if (!key || !ALLOWED_KEYS.includes(key)) {
      return NextResponse.json({ ok: false, error: "Invalid key" }, { status: 400 })
    }

    const path = `data/content/${key}.json`
    const { owner, repo, branch, token } = getGithubConfig()

    const sha = await githubGetSha({ owner, repo, branch, token, path })

    const jsonText = JSON.stringify(data ?? {}, null, 2) + "\n"
    const contentBase64 = Buffer.from(jsonText, "utf8").toString("base64")

    await githubPutFile({
      owner,
      repo,
      branch,
      token,
      path,
      message: message || `Update ${key}`,
      contentBase64,
      sha,
    })

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: errMsg || "Save failed" }, { status: 500 })
  }
}
