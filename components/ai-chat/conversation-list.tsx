"use client"
import { format } from "date-fns"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import type { AiChatConversation } from "@/types"

interface ConversationListProps {
  conversations: AiChatConversation[]
  currentConversation: AiChatConversation | null
  onSelectConversation: (conversation: AiChatConversation) => void
  isLoading: boolean
}

export function ConversationList({
  conversations,
  currentConversation,
  onSelectConversation,
  isLoading,
}: ConversationListProps) {
  return (
    <ScrollArea className="h-full">
      {isLoading ? (
        <div className="p-4 space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No conversations yet</div>
      ) : (
        <div className="p-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md hover:bg-accent/50 transition-colors",
                "flex items-start gap-2",
                currentConversation?.id === conversation.id && "bg-accent",
              )}
            >
              <MessageSquare className="h-5 w-5 mt-0.5 shrink-0" />
              <div className="overflow-hidden">
                <p className="font-medium truncate">{conversation.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(conversation.updated_at), "MMM d, h:mm a")}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </ScrollArea>
  )
}
