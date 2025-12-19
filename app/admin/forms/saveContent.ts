export async function saveContent(key: string, content: unknown) {
  const res = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, content }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Save failed")
  }
}
