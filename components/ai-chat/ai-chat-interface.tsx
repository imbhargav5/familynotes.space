"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { PlusCircle, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/ai-chat/chat-message"
import { ConversationList } from "@/components/ai-chat/conversation-list"
import type { AiChatConversation, AiChatMessage } from "@/types"

export function AiChatInterface() {
  const [conversations, setConversations] = useState<AiChatConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<AiChatConversation | null>(null)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat({
    api: "/api/ai-chat",
    body: {
      conversationId: currentConversation?.id,
    },
    onFinish: () => {
      // Refresh conversations after a message is sent
      fetchConversations()
    },
  })

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadConversationMessages(currentConversation.id)
    } else {
      setMessages([])
    }
  }, [currentConversation])

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true)
      const response = await fetch("/api/ai-chat/conversations")
      if (!response.ok) throw new Error("Failed to fetch conversations")

      const data = await response.json()
      setConversations(data)

      // If there are conversations but none is selected, select the first one
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0])
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoadingConversations(false)
    }
  }

  const loadConversationMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true)
      const response = await fetch(`/api/ai-chat/conversations/${conversationId}/messages`)
      if (!response.ok) throw new Error("Failed to fetch messages")

      const data: AiChatMessage[] = await response.json()

      // Convert to the format expected by useChat
      const formattedMessages = data.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }))

      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error loading conversation messages:", error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const createNewConversation = async () => {
    try {
      const response = await fetch("/api/ai-chat/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Conversation",
        }),
      })

      if (!response.ok) throw new Error("Failed to create conversation")

      const newConversation = await response.json()
      setConversations((prev) => [newConversation, ...prev])
      setCurrentConversation(newConversation)
      setMessages([])
    } catch (error) {
      console.error("Error creating conversation:", error)
    }
  }

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) return

    // If no conversation is selected, create one first
    if (!currentConversation) {
      try {
        const response = await fetch("/api/ai-chat/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: input.length > 30 ? `${input.substring(0, 30)}...` : input,
          }),
        })

        if (!response.ok) throw new Error("Failed to create conversation")

        const newConversation = await response.json()
        setConversations((prev) => [newConversation, ...prev])
        setCurrentConversation(newConversation)

        // Now save the message to this conversation
        await fetch(`/api/ai-chat/conversations/${newConversation.id}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: input,
          }),
        })
      } catch (error) {
        console.error("Error creating conversation:", error)
        return
      }
    } else {
      // Save the user message to the database
      await fetch(`/api/ai-chat/conversations/${currentConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: input,
        }),
      })
    }

    // Submit the message to the AI
    handleSubmit(e)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
      {/* Sidebar with conversations */}
      <div className="w-64 border-r bg-muted/20">
        <div className="p-4 border-b">
          <Button onClick={createNewConversation} className="w-full justify-start" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ConversationList
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={setCurrentConversation}
          isLoading={loadingConversations}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {loadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-lg font-medium">Start a new conversation</h3>
              <p className="text-muted-foreground">
                Ask the AI assistant for help with notes, organization, or any family-related tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 border-t">
          <form onSubmit={handleMessageSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
          {error && <p className="text-sm text-destructive mt-2">Error: {error.message}</p>}
        </div>
      </div>
    </div>
  )
}
