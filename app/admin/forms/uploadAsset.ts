// app/admin/forms/uploadAsset.ts
export async function uploadAsset(opts: { file: File; path: string; message: string }) {
  const fd = new FormData()
  fd.append("file", opts.file)
  fd.append("path", opts.path)
  fd.append("message", opts.message)

  const res = await fetch("/api/admin/asset", {
    method: "POST",
    body: fd,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Upload failed")
  }

  const json = (await res.json()) as { ok: boolean; error?: string }
  if (!json.ok) throw new Error(json.error || "Upload failed")
  return json
}
