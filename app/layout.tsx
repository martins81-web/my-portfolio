import './globals.css'
import Navigation from '../components/Navigation'

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