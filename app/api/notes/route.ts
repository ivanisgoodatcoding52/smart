import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const subject = searchParams.get("subject") || ""

    let query = supabase.from("notes").select("*").order("created_at", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (subject && subject !== "all") {
      query = query.eq("subject", subject)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching notes:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notes: data })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}
