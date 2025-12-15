import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume | Eric Martins',
  description:
    'Professional resume of Eric Martins, Front End and API Developer',
}

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
