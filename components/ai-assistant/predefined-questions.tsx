"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPredefinedQuestions } from "@/actions/ai-assistant-actions"
import { useEffect } from "react"

interface PredefinedQuestion {
  id: string
  text: string
  description: string
  category: string
}

interface PredefinedQuestionsProps {
  onSelectQuestion: (question: string) => void
}

export function PredefinedQuestions({ onSelectQuestion }: PredefinedQuestionsProps) {
  const [questions, setQuestions] = useState<PredefinedQuestion[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function loadQuestions() {
      try {
        const predefinedQuestions = await getPredefinedQuestions()
        setQuestions(predefinedQuestions)
      } catch (error) {
        console.error("Error loading predefined questions:", error)
      }
    }

    loadQuestions()
  }, [])

  const categories = ["all", ...new Set(questions.map((q) => q.category))]

  const filteredQuestions = activeTab === "all" ? questions : questions.filter((q) => q.category === activeTab)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Suggested Questions</CardTitle>
        <CardDescription>Select a question to get started or type your own</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid gap-2">
              {filteredQuestions.map((question) => (
                <Button
                  key={question.id}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => onSelectQuestion(question.text)}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{question.text}</span>
                    <span className="text-xs text-muted-foreground mt-1">{question.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

