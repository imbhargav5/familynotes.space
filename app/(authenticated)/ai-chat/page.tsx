import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { AiChatInterface } from "@/components/ai-chat/ai-chat-interface"

export default async function AiChatPage() {
  const supabase = await createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Assistant</h2>
        <p className="text-muted-foreground">Chat with your AI assistant to help with notes, organization, and more.</p>
      </div>
      <AiChatInterface />
    </div>
  )
}
