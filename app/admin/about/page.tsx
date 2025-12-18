import { getAbout } from "@/data/about"

export default async function AboutPage() {
  const { aboutProfile, aboutProof, aboutTimeline, aboutSkills } = await getAbout()

  return (
    <>
      {aboutSkills.map(group => (
        <div key={group.title}>
          {group.items.map(s => (
            <div key={`${group.title}-${s}`}>{s}</div>
          ))}
        </div>
      ))}
    </>
  )
}
