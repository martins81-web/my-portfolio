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

  const json = (await res.json().catch(() => null)) as { ok: boolean; error?: string } | null

  if (!res.ok) {
    const err = json?.error || (await res.text().catch(() => "")) || "Upload failed"
    throw new Error(err)
  }

  if (!json?.ok) throw new Error(json?.error || "Upload failed")
  return json
}
