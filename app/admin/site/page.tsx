import { getSite } from "@/data/site"
import SiteForm from "./SiteForm"

export const dynamic = "force-dynamic"

export default async function AdminSitePage() {
  const site = await getSite()
  return <SiteForm initial={site} />
}
