export type Cta = { label: string; href: string }

export type HomeContent = {
  homeHero: {
    title: string
    subtitle: string
    description: string
    primaryCta: Cta
    secondaryCta: Cta
  }
  homeHighlights: Array<{ title: string; description: string }>
  featuredProjectSlugs: string[]
  testimonials: Array<{ name: string; role: string; quote: string }>
}
