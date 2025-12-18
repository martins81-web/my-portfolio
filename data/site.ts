import { fetchGithubJson } from "@/lib/content"

type SiteJson = {
  name: string
  email: string
  location: string
  socials?: { github?: string; linkedin?: string }
}

export async function getSite() {
  return fetchGithubJson<SiteJson>({ path: "data/content/site.json", revalidateSeconds: 30 })
}
