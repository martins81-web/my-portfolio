import { cache } from "react"

type GithubJsonOpts = {
  path: string
  revalidateSeconds?: number
}

type GithubContentsResponse = {
  content: string
  encoding: "base64" | string
}

export const fetchGithubJson = cache(async function fetchGithubJson<T>({
  path,
  revalidateSeconds = 30,
}: GithubJsonOpts): Promise<T> {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? "main"
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo) {
    throw new Error("Missing GITHUB_OWNER or GITHUB_REPO")
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: revalidateSeconds },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub fetch failed for ${path}: ${res.status} ${text}`)
  }

  const json = (await res.json()) as GithubContentsResponse
  const decoded = Buffer.from(json.content, "base64").toString("utf8")
  return JSON.parse(decoded) as T
})
