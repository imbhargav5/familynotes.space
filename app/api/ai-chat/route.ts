import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { messages, conversationId } = await req.json()

    // Stream the response from the AI model
    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      system:
        "You are a helpful assistant for Family Notes, a family organization app. Help users with creating notes, organizing information, tracking expenses, and other family-related tasks. Be concise, friendly, and helpful.",
    })

    // If there's a conversationId, save the message to the database
    if (conversationId) {
      // We'll save the message after the stream completes
      result.text.then(async (completedText) => {
        try {
          await supabase.from("ai_chat_messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: completedText,
            user_id: user.id,
          })
        } catch (error) {
          console.error("Error saving assistant message:", error)
        }
      })
    }

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in AI chat:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
