import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn("rounded-lg px-3 py-2 max-w-[80%]", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown className="prose prose-sm dark:prose-invert">{message.content}</ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
