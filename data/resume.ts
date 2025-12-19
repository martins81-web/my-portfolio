import { fetchGithubJson } from "@/lib/content"
import type { ResumeContent } from "@/types/resume"

export async function getResume(): Promise<ResumeContent> {
  return fetchGithubJson<ResumeContent>({ path: "data/content/resume.json" })
}
