export async function uploadAsset(params: { path: string; file: File; message?: string }) {
  const fd = new FormData()
  fd.append("path", params.path)
  fd.append("message", params.message || "Update asset")
  fd.append("file", params.file)

  const res = await fetch("/api/admin/asset", { method: "POST", body: fd })
  const json = await res.json().catch(() => null)

  if (!res.ok || !json?.ok) throw new Error(json?.error || "Upload failed")
  return { path: String(json.path), url: String(json.url) }
}
