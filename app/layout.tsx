import './globals.css'
import Navigation from '../components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Eric Martins | Front-End & API Developer',
    template: '%s | Eric Martins',
  },
  description:
    'Front-End and API Developer specialized in React, Angular, Next.js and API integration.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <Navigation />
        {children}
      </body>
    </html>
  )
}