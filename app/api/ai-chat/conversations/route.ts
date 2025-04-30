import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get all conversations for the user
    const { data, error } = await supabase
      .from("ai_chat_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching conversations:", error)
      return new NextResponse("Error fetching conversations", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/ai-chat/conversations:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

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

    const { title } = await req.json()

    // Create a new conversation
    const { data, error } = await supabase
      .from("ai_chat_conversations")
      .insert({
        title: title || "New Conversation",
        user_id: user.id,
      })
      .select()

    if (error) {
      console.error("Error creating conversation:", error)
      return new NextResponse("Error creating conversation", { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in POST /api/ai-chat/conversations:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
