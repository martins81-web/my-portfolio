import Link from "next/link"
import { site } from "@/data/site"

type FooterLink = { label: string; href: string }

const primaryLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
]

const legalLinks: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

function yearNow() {
  return new Date().getFullYear()
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.35-1.18-3.35-1.18c-.45-1.15-1.1-1.46-1.1-1.46c-.9-.62.07-.61.07-.61c1 .07 1.53 1.03 1.53 1.03c.89 1.52 2.34 1.08 2.91.83c.09-.65.35-1.08.63-1.33c-2.21-.25-4.54-1.11-4.54-4.95c0-1.09.39-1.99 1.03-2.69c-.1-.25-.45-1.27.1-2.65c0 0 .84-.27 2.75 1.03c.8-.22 1.65-.33 2.5-.33c.85 0 1.7.11 2.5.33c1.91-1.3 2.75-1.03 2.75-1.03c.55 1.38.2 2.4.1 2.65c.64.7 1.03 1.6 1.03 2.69c0 3.85-2.34 4.7-4.57 4.95c.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="-2 -2 28 28"
      fill="currentColor"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5S1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0.5 23.5h4V7.98h-4V23.5zM8.5 7.98h3.83v2.12h.05c.53-1 1.84-2.12 3.79-2.12c4.05 0 4.8 2.66 4.8 6.12v9.4h-4v-8.33c0-1.99-.04-4.55-2.78-4.55c-2.78 0-3.2 2.17-3.2 4.41v8.47h-4V7.98z" />
    </svg>
  )
}

const wrap: React.CSSProperties = {
  marginTop: 32,
}
export default function Footer() {
  const wrap: React.CSSProperties = {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    marginTop: 48,
  }

  const inner: React.CSSProperties = {
    maxWidth: 1040,
    margin: "0 auto",
    padding: "28px 16px",
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
  }

  const brand: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 220,
  }

  const title: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.2,
  }

  const small: React.CSSProperties = {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 1.5,
    maxWidth: 420,
  }

  const cols: React.CSSProperties = {
    display: "flex",
    gap: 32,
    flexWrap: "wrap",
    alignItems: "flex-start",
  }

  const col: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 140,
  }

  const linkStyle: React.CSSProperties = {
    fontSize: 13,
    opacity: 0.85,
    textDecoration: "none",
  }

  const bottom: React.CSSProperties = {
    maxWidth: 1040,
    margin: "0 auto",
    padding: "0 16px 22px 16px",
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    opacity: 0.8,
    fontSize: 12,
  }

  const socials: React.CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
  }

  const iconBtn: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    display: "grid",
    placeItems: "center",
    textDecoration: "none",
    opacity: 0.9,
    overflow: "visible"
  }

  const githubUrl = site.socials?.github
  const linkedinUrl = site.socials?.linkedin

  return (
    <footer style={wrap}>
      <div style={inner}>
        <div style={brand}>
          <div style={title}>{site.name}</div>
          <div style={small}>
            Front end and API developer. File based content for now, with simple data in the repo.
          </div>
        </div>

        <div style={cols}>
          <nav style={col} aria-label="Footer primary">
            <div style={{ ...title, fontSize: 14 }}>Pages</div>
            {primaryLinks.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav style={col} aria-label="Footer legal">
            <div style={{ ...title, fontSize: 14 }}>Legal</div>
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div style={col}>
            <div style={{ ...title, fontSize: 14 }}>Contact</div>
            <a href={`mailto:${site.email}`} style={linkStyle}>
              {site.email}
            </a>
            <div style={small}>{site.location}</div>
          </div>
        </div>
      </div>

      <div style={bottom}>
        <div>© {yearNow()} {site.name}. All rights reserved.</div>

        <div style={socials}>
          {githubUrl ? (
            <a href={githubUrl} target="_blank" rel="noreferrer" style={iconBtn} title="GitHub">
              <GithubIcon />
            </a>
          ) : null}

          {linkedinUrl ? (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" style={iconBtn} title="LinkedIn">
              <LinkedInIcon />
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
