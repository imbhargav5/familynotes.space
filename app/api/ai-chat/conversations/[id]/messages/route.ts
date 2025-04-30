import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get all messages for the conversation
    const { data, error } = await supabase
      .from("ai_chat_messages")
      .select("*")
      .eq("conversation_id", params.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return new NextResponse("Error fetching messages", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in GET /api/ai-chat/conversations/${params.id}/messages:`, error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { content } = await req.json()

    if (!content) {
      return new NextResponse("Message content is required", { status: 400 })
    }

    // Create a new message
    const { data, error } = await supabase
      .from("ai_chat_messages")
      .insert({
        conversation_id: params.id,
        content,
        role: "user",
        user_id: user.id,
      })
      .select()

    if (error) {
      console.error("Error creating message:", error)
      return new NextResponse("Error creating message", { status: 500 })
    }

    // Update the conversation's updated_at timestamp
    await supabase.from("ai_chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", params.id)

    return NextResponse.json(data[0])
  } catch (error) {
    console.error(`Error in POST /api/ai-chat/conversations/${params.id}/messages:`, error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
