import { createClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/api-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Validate API key
  const authResult = await validateApiKey(request)
  if (!authResult.valid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase.from("notes").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
