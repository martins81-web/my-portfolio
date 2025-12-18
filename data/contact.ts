export type ContactLink = {
  label: string
  href: string
  description?: string
}

export const contactEmail = "ericmartins81@gmail.com"

export const contactLinks: ContactLink[] = [
  { label: "Email", href: `mailto:${contactEmail}`, description: "Send me an email" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ericmartins81", description: "Connect on LinkedIn" },
  { label: "GitHub", href: "https://github.com/martins81-web", description: "View my repositories" },
]
