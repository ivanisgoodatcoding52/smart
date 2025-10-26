import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Get recent notes for context
  const supabase = await createClient()
  const { data: recentNotes } = await supabase
    .from("notes")
    .select("title, description, category, subject")
    .order("created_at", { ascending: false })
    .limit(5)

  const contextInfo = recentNotes
    ? `\n\nRecent study materials available on the platform:\n${recentNotes
        .map((note) => `- ${note.title} (${note.category}, ${note.subject})`)
        .join("\n")}`
    : ""

  const systemPrompt = `You are a helpful AI study assistant for a college platform. You help students with:
- Understanding complex topics and concepts
- Creating personalized study plans
- Explaining academic subjects clearly
- Providing tips for standardized tests (SAT, ACT, AP exams)
- Offering college admission advice
- Recommending study strategies

Be encouraging, clear, and educational. Break down complex topics into understandable parts.
Use examples when helpful. If asked about specific notes or materials, you can reference the recent uploads.${contextInfo}`

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    messages,
  })

  return result.toUIMessageStreamResponse()
}
