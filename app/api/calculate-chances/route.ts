import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gpa, satScore, actScore, testType, apClasses, extracurriculars, awards, intendedMajor, collegeName } = body

    const supabase = await createClient()

    // Fetch college data
    let collegeData = null
    if (collegeName) {
      const { data } = await supabase.from("colleges").select("*").ilike("name", `%${collegeName}%`).limit(1).single()

      collegeData = data
    }

    // Calculate admission chance
    const chance = calculateAdmissionChance({
      gpa,
      testScore: testType === "sat" ? satScore : actScore * 40 + 160, // Convert ACT to SAT scale
      apClasses,
      extracurriculars,
      awards,
      collegeData,
    })

    // Generate comparison
    const comparison = generateComparison({
      gpa,
      testScore: testType === "sat" ? satScore : actScore * 40 + 160,
      collegeData,
    })

    // Generate strengths and improvements
    const { strengths, improvements } = analyzeProfile({
      gpa,
      testScore: testType === "sat" ? satScore : actScore,
      testType,
      apClasses,
      extracurriculars,
      awards,
    })

    // Generate AI feedback
    const aiFeedback = generateAIFeedback({
      chance,
      strengths,
      improvements,
      collegeName: collegeName || "your target college",
    })

    return NextResponse.json({
      collegeName: collegeName || "Target College",
      admissionChance: chance,
      category: chance >= 70 ? "safety" : chance >= 40 ? "target" : "reach",
      comparison,
      strengths,
      improvements,
      aiFeedback,
    })
  } catch (error) {
    console.error("[v0] Calculation error:", error)
    return NextResponse.json({ error: "Failed to calculate chances" }, { status: 500 })
  }
}

function calculateAdmissionChance({ gpa, testScore, apClasses, extracurriculars, awards, collegeData }: any): number {
  let baseChance = 50

  // GPA factor (0-30 points)
  if (gpa >= 4.0) baseChance += 30
  else if (gpa >= 3.7) baseChance += 20
  else if (gpa >= 3.3) baseChance += 10
  else if (gpa < 3.0) baseChance -= 20

  // Test score factor (0-25 points)
  if (testScore >= 1500) baseChance += 25
  else if (testScore >= 1400) baseChance += 15
  else if (testScore >= 1300) baseChance += 5
  else if (testScore < 1100) baseChance -= 15

  // AP classes factor (0-15 points)
  if (apClasses >= 10) baseChance += 15
  else if (apClasses >= 6) baseChance += 10
  else if (apClasses >= 3) baseChance += 5

  // Extracurriculars factor (0-15 points)
  const ecPoints = {
    minimal: -5,
    moderate: 5,
    strong: 10,
    exceptional: 15,
  }
  baseChance += ecPoints[extracurriculars as keyof typeof ecPoints] || 0

  // Awards factor (0-15 points)
  const awardPoints = {
    none: 0,
    some: 5,
    many: 10,
    exceptional: 15,
  }
  baseChance += awardPoints[awards as keyof typeof awardPoints] || 0

  // Adjust based on college data if available
  if (collegeData) {
    const avgGPA = collegeData.avg_gpa || 3.5
    const avgSAT = collegeData.avg_sat || 1300

    if (gpa < avgGPA - 0.3) baseChance -= 10
    if (testScore < avgSAT - 100) baseChance -= 10
  }

  // Clamp between 5 and 95
  return Math.max(5, Math.min(95, Math.round(baseChance)))
}

function generateComparison({ gpa, testScore, collegeData }: any) {
  const avgGPA = collegeData?.avg_gpa || 3.5
  const avgSAT = collegeData?.avg_sat || 1300

  return {
    gpa: gpa >= avgGPA ? "Above Average" : gpa >= avgGPA - 0.2 ? "Average" : "Below Average",
    testScore: testScore >= avgSAT ? "Above Average" : testScore >= avgSAT - 50 ? "Average" : "Below Average",
    overall: gpa >= avgGPA && testScore >= avgSAT ? "Competitive" : "Developing",
  }
}

function analyzeProfile({ gpa, testScore, testType, apClasses, extracurriculars, awards }: any) {
  const strengths: string[] = []
  const improvements: string[] = []

  // GPA analysis
  if (gpa >= 4.0) {
    strengths.push("Excellent GPA demonstrates strong academic performance")
  } else if (gpa < 3.3) {
    improvements.push("Focus on improving your GPA through consistent study habits")
  }

  // Test score analysis
  const isHighScore = testType === "sat" ? testScore >= 1400 : testScore >= 30
  if (isHighScore) {
    strengths.push("Strong standardized test scores show academic readiness")
  } else {
    improvements.push("Consider retaking standardized tests or focusing on test prep")
  }

  // AP classes
  if (apClasses >= 6) {
    strengths.push("Rigorous course load with multiple AP classes")
  } else if (apClasses < 3) {
    improvements.push("Take more AP or honors classes to demonstrate academic challenge")
  }

  // Extracurriculars
  if (extracurriculars === "strong" || extracurriculars === "exceptional") {
    strengths.push("Strong extracurricular involvement with leadership roles")
  } else if (extracurriculars === "minimal") {
    improvements.push("Increase extracurricular involvement and seek leadership positions")
  }

  // Awards
  if (awards === "many" || awards === "exceptional") {
    strengths.push("Impressive awards and recognition demonstrate excellence")
  } else if (awards === "none") {
    improvements.push("Pursue competitions and opportunities for recognition in your field")
  }

  return { strengths, improvements }
}

function generateAIFeedback({ chance, strengths, improvements, collegeName }: any): string {
  if (chance >= 70) {
    return `You have a strong profile for ${collegeName}. Your ${strengths[0]?.toLowerCase() || "academic achievements"} position you well. To further strengthen your application, consider ${improvements[0]?.toLowerCase() || "enhancing your extracurricular profile"}. Focus on crafting compelling essays that showcase your unique perspective and experiences.`
  } else if (chance >= 40) {
    return `You have a competitive chance at ${collegeName}. Your profile shows promise, particularly in ${strengths[0]?.toLowerCase() || "several areas"}. To improve your odds, prioritize ${improvements[0]?.toLowerCase() || "strengthening your academic profile"}. Consider applying Early Decision/Action if this is your top choice, as it can boost admission rates.`
  } else {
    return `${collegeName} is currently a reach school for your profile. While challenging, it's not impossible. Focus on ${improvements[0]?.toLowerCase() || "improving your academic metrics"} and ${improvements[1]?.toLowerCase() || "building your extracurricular profile"}. Consider applying to a balanced list of reach, target, and safety schools. Your essays and recommendations will be crucial in demonstrating your potential.`
  }
}
