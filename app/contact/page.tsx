import type { Metadata } from "next"
import ContactClient from "./ContactClient"
import { pageSeo } from "../../data/seo"

export const metadata: Metadata = {
  title: pageSeo.contact.title,
  description: pageSeo.contact.description,
}

export default function ContactPage() {
  return <ContactClient />
}
