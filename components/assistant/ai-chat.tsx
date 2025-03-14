"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SendHorizontal, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Carbonly AI assistant. How can I help you with your carbon emissions tracking today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // In a real implementation, this would call your AI API
      // For now, we'll simulate a response
      setTimeout(() => {
        const responses = [
          "Based on your current data, your organization's emissions have decreased by 12% compared to last quarter. Great progress!",
          "I can help you identify which projects are contributing most to your carbon footprint. Would you like me to analyze your top 3 emission sources?",
          "To reduce your Scope 3 emissions, consider implementing supplier sustainability requirements and optimizing your logistics network.",
          "Your current carbon intensity is 0.35 tCO₂e per $1000 revenue, which is below industry average. Keep up the good work!",
          "I've noticed unusual emission patterns in your manufacturing division. Would you like me to generate a detailed report for further investigation?",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error getting AI response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
        },
      ])
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <Card className="flex-1 mb-4">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    message.role === "assistant" ? "" : "flex-row-reverse"
                  }`}
                >
                  <Avatar className={message.role === "assistant" ? "bg-primary/10" : "bg-muted"}>
                    <AvatarFallback>
                      {message.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <Avatar className="bg-primary/10">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-3 bg-muted text-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Ask about your carbon emissions, sustainability goals, or how to reduce your footprint..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[60px] flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <SendHorizontal className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}

