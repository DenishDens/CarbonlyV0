"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, X, Send, MessageSquare } from "lucide-react"
import { useChat } from "@/contexts/chat-context"
import { useUser } from "@/hooks/use-user"

const predefinedQuestions = [
  "How many incidents were reported this month?",
  "What are the most common materials in our database?",
  "Show me the latest incident reports",
  "What is our current carbon footprint?",
  "How can I reduce emissions in my project?",
]

export function AIChatWidget() {
  const [input, setInput] = useState("")
  const [mounted, setMounted] = useState(false)
  const { user } = useUser()
  const { isOpen, toggleChat, messages, addMessage, userName, setUserName } = useChat()

  // Use useEffect to set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)

    // Add welcome message when component mounts if user is available
    if (user?.user_metadata?.full_name && !userName) {
      setUserName(user.user_metadata.full_name)
      if (messages.length === 0) {
        addMessage({
          id: "welcome",
          content: `Hi ${user.user_metadata.full_name}! 👋 I can help you analyze incident data and query the Material Library. Try asking about incidents or materials.`,
          role: "assistant",
          timestamp: new Date(),
        })
      }
    }
  }, [user, userName, messages.length, setUserName, addMessage])

  // Don't render anything until component is mounted
  if (!mounted) {
    return null
  }

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    addMessage({
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    })

    // Clear input
    setInput("")

    try {
      // TODO: Implement AI response logic here
      // For now, just add a placeholder response
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          content: "I'm processing your request. This feature will be implemented soon.",
          role: "assistant",
          timestamp: new Date(),
        })
      }, 1000)
    } catch (error) {
      console.error("Error processing message:", error)
    }
  }

  const handleQuestionSelect = (question: string) => {
    setInput(question)
  }

  if (!isOpen) {
    return (
      <Button onClick={toggleChat} className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 z-50 shadow-lg">
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[380px] shadow-lg z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div>
          <h3 className="font-semibold">AI Assistant</h3>
          <p className="text-sm text-muted-foreground">Ask about incident data or materials</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={toggleChat}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`rounded-lg px-4 py-2 ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-4">
        <div className="flex w-full space-x-2">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about incidents or materials..."
              className="pr-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend()
                }
              }}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Suggested questions:</p>
                  <div className="space-y-1">
                    {predefinedQuestions.map((question) => (
                      <Button
                        key={question}
                        variant="ghost"
                        className="w-full justify-start text-sm h-auto py-2"
                        onClick={() => handleQuestionSelect(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

