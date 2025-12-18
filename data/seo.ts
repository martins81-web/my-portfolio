export const seo = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: "Eric Martins",
  defaultTitle: "Eric Martins | Front-End & API Developer",
  titleTemplate: "%s | Eric Martins",
  description:
    "Front-End and API Developer specialized in React, Angular, Next.js and API integration.",
  openGraph: {
    type: "website" as const,
    url: "/",
  },
  twitter: {
    card: "summary_large_image" as const,
  },
  robots: { index: true, follow: true },
}
export const pageSeo = {
  home: {
    title: "Home",
    description: seo.description,
  },
  projects: {
    title: "Projects",
    description: "Projects built with React, Angular, Vue, and Next.js.",
  },
  technologies: {
    title: "Technologies",
    description: "Frameworks and tools used across projects.",
  },
  resume: {
    title: "Resume",
    description: "Professional resume of Eric Martins.",
  },
  about: {
    title: "About",
    description: "About Eric Martins, Front End and API Developer.",
  },
  contact: {
    title: "Contact",
    description: "Contact Eric Martins.",
  },
}