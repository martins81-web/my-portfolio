import { NextResponse } from "next/server"
import path from "path"
import { readFile } from "fs/promises"

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "Eric_Martins_CV.pdf")
  const file = await readFile(filePath)

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Eric_Martins_CV.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  })
}
