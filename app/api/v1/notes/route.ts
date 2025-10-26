import { createClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/api-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Validate API key
  const authResult = await validateApiKey(request)
  if (!authResult.valid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const subject = searchParams.get("subject")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const supabase = await createClient()
    let query = supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq("category", category)
    }

    if (subject) {
      query = query.eq("subject", subject)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        limit,
        offset,
        total: count,
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
