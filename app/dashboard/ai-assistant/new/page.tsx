"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PredefinedQuestions } from "@/components/ai-assistant/predefined-questions"
import { getPredefinedQuestions, saveConversation } from "@/actions/ai-assistant-actions"
import { Loader2, MessageSquare } from "lucide-react"

export default function NewConversationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState("New Conversation")
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState("")

  const predefinedQuestions = getPredefinedQuestions()

  const handleCreateConversation = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      // Create initial messages
      const messages = [
        {
          id: crypto.randomUUID(),
          role: "system" as const,
          content: "I am CarbonlyAI, your carbon emissions analysis assistant. How can I help you today?",
          timestamp: new Date(),
        },
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content:
            "Hello! I'm CarbonlyAI, your carbon emissions analysis assistant. I can help you understand your emissions data, analyze trends, and provide recommendations for reduction. What would you like to know?",
          timestamp: new Date(),
        },
      ]

      // Add user question if selected
      if (selectedQuestion) {
        messages.push({
          id: crypto.randomUUID(),
          role: "user" as const,
          content: selectedQuestion,
          timestamp: new Date(),
        })
      }

      // Save the conversation
      const conversation = await saveConversation({
        title,
        messages,
        userId: user.id,
        projectId,
      })

      // Redirect to the conversation
      router.push(`/dashboard/ai-assistant/${conversation.id}`)

      // Generate AI response if there's a question
      if (selectedQuestion) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating conversation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Conversation</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Conversation Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this conversation"
                />
              </div>

              <div>
                <Label htmlFor="project">Project (Optional)</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific project</SelectItem>
                    {/* This would be populated from your projects */}
                    <SelectItem value="project-1">Project 1</SelectItem>
                    <SelectItem value="project-2">Project 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Selecting a project will allow the AI to analyze specific emission data
                </p>
              </div>

              <Button onClick={handleCreateConversation} disabled={isLoading || !title.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {selectedQuestion ? "Ask Question" : "Start Conversation"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <PredefinedQuestions
            questions={predefinedQuestions}
            onSelectQuestion={(question) => setSelectedQuestion(question)}
          />
        </div>
      </div>
    </div>
  )
}

