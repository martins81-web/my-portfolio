export async function saveContent(key: string, data: unknown, message?: string) {
  const res = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, data, message }),
  })

  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.ok) throw new Error(json?.error || "Save failed")
  return true
}

