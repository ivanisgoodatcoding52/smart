import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function validateApiKey(
  request: NextRequest,
): Promise<{ valid: boolean; keyId?: string; error?: string }> {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Missing or invalid authorization header" }
  }

  const apiKey = authHeader.substring(7)

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("api_keys").select("*").eq("key", apiKey).eq("is_active", true).single()

    if (error || !data) {
      return { valid: false, error: "Invalid API key" }
    }

    // Check if key is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: "API key has expired" }
    }

    // Update last used timestamp and request count
    await supabase
      .from("api_keys")
      .update({
        last_used_at: new Date().toISOString(),
        request_count: (data.request_count || 0) + 1,
      })
      .eq("id", data.id)

    return { valid: true, keyId: data.id }
  } catch (error) {
    console.error("[v0] API key validation error:", error)
    return { valid: false, error: "Internal server error" }
  }
}
