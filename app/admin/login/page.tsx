import { Suspense } from "react"
import LoginClient from "./LoginClient"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main style={{ maxWidth: 520, margin: "0 auto", padding: "48px 16px" }}>Loading</main>}>
      <LoginClient />
    </Suspense>
  )
}