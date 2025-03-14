"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { AIAssistantMessage } from "@/types/ai-assistant"
import { addMessageToConversation, generateAIResponse } from "@/actions/ai-assistant-actions"
import { Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"

interface AIChatProps {
  conversationId: string
  initialMessages: AIAssistantMessage[]
  projectId?: string
}

export function AIChat({ conversationId, initialMessages, projectId }: AIChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<AIAssistantMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return

    try {
      // Add user message to UI immediately
      const userMessage: AIAssistantMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      // Save user message to database
      await addMessageToConversation(
        conversationId,
        {
          role: "user",
          content: input,
        },
        user.id,
      )

      // Generate AI response
      const aiMessage = await generateAIResponse(conversationId, projectId, user.id)

      // Add AI message to UI
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <Card
              className={cn(
                "max-w-[80%] p-3",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              <div className="space-y-1">
                <div className="text-xs opacity-70">
                  {message.role === "user" ? "You" : "CarbonlyAI"} • {format(new Date(message.timestamp), "h:mm a")}
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-3 bg-muted">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>CarbonlyAI is thinking...</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask CarbonlyAI a question..."
            className="flex-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

