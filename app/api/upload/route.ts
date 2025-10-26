import { put } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const authorName = formData.get("authorName") as string
    const category = formData.get("category") as string
    const subject = formData.get("subject") as string
    const tags = formData.get("tags") as string
    const externalLink = formData.get("externalLink") as string | null

    if (!title || !authorName || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let fileUrl = externalLink || null
    let fileName = null
    let fileSize = null
    let fileType = null

    // Upload file to Blob if provided
    if (file) {
      const blob = await put(file.name, file, {
        access: "public",
      })
      fileUrl = blob.url
      fileName = file.name
      fileSize = file.size
      fileType = file.type
    }

    // Save to database
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("notes")
      .insert({
        title,
        description,
        author_name: authorName,
        category,
        subject,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ note: data })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
