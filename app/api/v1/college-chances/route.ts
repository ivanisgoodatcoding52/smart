import { validateApiKey } from "@/lib/api-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Validate API key
  const authResult = await validateApiKey(request)
  if (!authResult.valid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { gpa, sat, act, school } = body

    if (!gpa || (!sat && !act)) {
      return NextResponse.json({ error: "Missing required parameters: gpa and (sat or act)" }, { status: 400 })
    }

    // Simple calculation for API
    const testScore = sat || act * 40 + 160
    let chance = 50

    if (gpa >= 4.0) chance += 20
    else if (gpa >= 3.5) chance += 10
    else if (gpa < 3.0) chance -= 15

    if (testScore >= 1400) chance += 20
    else if (testScore >= 1200) chance += 10
    else if (testScore < 1000) chance -= 15

    chance = Math.max(5, Math.min(95, chance))

    return NextResponse.json({
      data: {
        school: school || "Target College",
        admissionChance: chance,
        category: chance >= 70 ? "safety" : chance >= 40 ? "target" : "reach",
        gpa,
        testScore: sat || act,
        testType: sat ? "SAT" : "ACT",
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
