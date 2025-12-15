import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | Eric Martins',
  description:
    'Selected projects built with React, Angular, Vue and Next.js',
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
