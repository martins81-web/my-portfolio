import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Professional resume of Eric Martins, Front-End and API Developer with experience in React, Angular and APIs.',
}

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
