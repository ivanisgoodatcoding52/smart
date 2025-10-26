import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Generate API key
    const apiKey = `cpk_${randomBytes(32).toString("hex")}`

    // Save to database
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        key: apiKey,
        name,
        email,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Key generation error:", error)
      return NextResponse.json({ error: "Failed to generate API key" }, { status: 500 })
    }

    return NextResponse.json({
      apiKey,
      message: "API key generated successfully. Please save it securely - you won't be able to see it again.",
    })
  } catch (error) {
    console.error("[v0] Key generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
