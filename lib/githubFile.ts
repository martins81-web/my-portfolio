// lib/githubFile.ts
type GithubContentsResponse = {
  content: string
  encoding: "base64" | string
  sha?: string
}

function env(name: string) {
  const v = process.env[name]
  return v && v.trim() ? v.trim() : ""
}

export async function fetchGithubFile(path: string): Promise<ArrayBuffer> {
  const owner = env("GITHUB_OWNER") || env("GITHUB_CONTENT_OWNER")
  const repo = env("GITHUB_REPO") || env("GITHUB_CONTENT_REPO")
  const branch = env("GITHUB_BRANCH") || env("GITHUB_CONTENT_BRANCH") || "main"
  const token = env("GITHUB_TOKEN") || env("GITHUB_CONTENT_TOKEN")

  if (!owner || !repo) throw new Error("Missing GitHub owner or repo env vars")

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub file fetch failed for ${path}: ${res.status} ${text}`)
  }

  const json = (await res.json()) as GithubContentsResponse
  if (!json.content || json.encoding !== "base64") {
    throw new Error(`Unexpected GitHub contents payload for ${path}`)
  }

  const buf = Buffer.from(json.content, "base64")
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  return ab
}
