import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="border-b p-4">
      <ul className="flex gap-6">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/technologies">Technologies</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </nav>
  )
}
