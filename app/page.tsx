import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eric Martins Portfolio',
  description:
    'Web developer specializing in React, Angular, Vue and Next.js projects',
}


export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Eric Martins Portfolio
      </h1>
      <p className="mt-4">
        Web developer specializing in front end and API integration.
      </p>
    </main>
  )
}
