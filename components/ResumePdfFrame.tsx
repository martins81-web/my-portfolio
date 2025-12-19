"use client"

import { useState } from "react"

export default function ResumePdfFrame() {
  const [src] = useState(() => `/api/asset/resume?v=${Date.now()}`)
  return (
    <iframe
      src={src}
      title="Eric Martins Resume"
      className="w-full h-[75vh] min-h-[520px]"
    />
  )
}
