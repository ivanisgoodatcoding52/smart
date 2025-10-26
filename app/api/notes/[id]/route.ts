import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase.from("notes").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Increment view count
    await supabase
      .from("notes")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", id)

    return NextResponse.json({ note: data })
  } catch (error) {
    console.error("[v0] Error fetching note:", error)
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 })
  }
}
