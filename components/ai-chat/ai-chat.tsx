"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { processNaturalLanguageQuery, saveChatMessage, getPredefinedQuestions } from "@/app/actions/ai-chat-actions"
import type { ChatMessage } from "@/types/ai-chat"
import { Send, Bot, User, Sparkles, BarChart2, TrendingUp, PieChart, ArrowUpRight, ShieldAlert } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { EmissionDataChart } from "./emission-data-chart"
import { SingleValueCard } from "./single-value-card"
import { PredictionChart } from "./prediction-chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AIChat() {
  const [sessionId, setSessionId] = useState<string>(() => {
    // Try to get existing session ID from localStorage or create a new one
    const storedId = typeof window !== "undefined" ? localStorage.getItem("chatSessionId") : null
    const newId = storedId || uuidv4()
    if (typeof window !== "undefined" && !storedId) {
      localStorage.setItem("chatSessionId", newId)
    }
    return newId
  })

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTab, setCurrentTab] = useState("chat")
  const [predefinedQuestions, setPredefinedQuestions] = useState<string[]>([])
  const [queryResult, setQueryResult] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load predefined questions
  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await getPredefinedQuestions()
      setPredefinedQuestions(questions)
    }
    loadQuestions()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    // Add user message to UI
    setMessages((prev) => [...prev, userMessage])

    // Clear input and set processing state
    setInput("")
    setIsProcessing(true)

    try {
      // Save user message to database
      await saveChatMessage(sessionId, {
        role: "user",
        content: input,
      })

      // Process the query
      const result = await processNaturalLanguageQuery(input)
      setQueryResult(result)

      // Check if there was an access error
      if (result.summary?.startsWith("Error: Unauthorized")) {
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content:
            "You don't have access to this data. Please contact your administrator if you believe this is an error.",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, errorMessage])

        // Save error message
        await saveChatMessage(sessionId, {
          role: "assistant",
          content:
            "You don't have access to this data. Please contact your administrator if you believe this is an error.",
        })

        setIsProcessing(false)
        return
      }

      // Create assistant response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: result.summary,
        timestamp: new Date(),
      }

      // Add assistant message to UI
      setMessages((prev) => [...prev, assistantMessage])

      // Save assistant message to database
      await saveChatMessage(sessionId, {
        role: "assistant",
        content: result.summary,
      })

      // Switch to results tab if we have visualization data
      if (result.chartData || result.singleValue || result.prediction) {
        setCurrentTab("results")
      }
    } catch (error) {
      console.error("Error processing query:", error)

      // Check if it's an authorization error
      const errorMessage =
        error instanceof Error && error.message.includes("Unauthorized")
          ? "You don't have access to this data. Please contact your administrator if you believe this is an error."
          : "Sorry, I encountered an error processing your query. Please try again."

      // Add error message
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMsg])

      // Save error message
      await saveChatMessage(sessionId, {
        role: "assistant",
        content: errorMessage,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePredefinedQuestion = (question: string) => {
    setInput(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const startNewChat = () => {
    const newId = uuidv4()
    setSessionId(newId)
    setMessages([])
    setQueryResult(null)
    localStorage.setItem("chatSessionId", newId)
  }

  // Determine which visualization to show based on query intent
  const renderVisualization = () => {
    if (!queryResult) return null

    const intent = queryResult.query.intent as QueryIntent

    if (intent === "single_value" && queryResult.singleValue) {
      return <SingleValueCard singleValue={queryResult.singleValue} />
    }

    if (queryResult.chartData) {
      if (intent === "prediction" && queryResult.prediction) {
        return <PredictionChart chartData={queryResult.chartData} prediction={queryResult.prediction} />
      }

      return <EmissionDataChart data={queryResult.chartData.data} type={queryResult.chartData.type} />
    }

    // Default table view for data
    return renderDataTable()
  }

  // Render data table for results
  const renderDataTable = () => {
    if (!queryResult || !queryResult.data || queryResult.data.length === 0) {
      return (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p>No data available for this query.</p>
        </div>
      )
    }

    // Get table headers from first data item
    const headers = Object.keys(queryResult.data[0])

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                {headers.map((header) => (
                  <th key={header} className="px-4 py-2 text-left">
                    {header.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResult.data.slice(0, 10).map((item: any, index: number) => (
                <tr key={index} className="border-t">
                  {headers.map((header) => (
                    <td key={`${index}-${header}`} className="px-4 py-2">
                      {formatCellValue(item[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {queryResult.data.length > 10 && (
          <div className="text-center p-2 text-sm text-muted-foreground">
            Showing 10 of {queryResult.data.length} records
          </div>
        )}
      </div>
    )
  }

  // Format cell values for display
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "-"

    if (typeof value === "number") {
      // Format numbers with 2 decimal places if they have decimals
      return Number.isInteger(value) ? value.toString() : value.toFixed(2)
    }

    if (value instanceof Date || (typeof value === "string" && !isNaN(Date.parse(value)))) {
      // Format dates
      try {
        return new Date(value).toLocaleDateString()
      } catch (e) {
        return value.toString()
      }
    }

    return value.toString()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Carbon Emissions AI Assistant
        </CardTitle>
        <CardDescription>Ask questions about your carbon emissions data in natural language</CardDescription>
      </CardHeader>

      {/* Security alert */}
      <Alert className="mx-4 mb-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Security Notice</AlertTitle>
        <AlertDescription>You can only query data from organizations you have access to.</AlertDescription>
      </Alert>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="results" disabled={!queryResult}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <CardContent className="p-4">
            <ScrollArea className="h-[400px] pr-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Sparkles className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-medium">Ask me about your emissions data</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    I can help you analyze your carbon footprint across different time periods and organizational units.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start gap-2 max-w-[80%] ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        } p-3 rounded-lg`}
                      >
                        {message.role === "assistant" && <Bot className="h-5 w-5 mt-1 flex-shrink-0" />}
                        <div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.role === "user" && <User className="h-5 w-5 mt-1 flex-shrink-0" />}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Suggested questions:</h4>
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.slice(0, 5).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePredefinedQuestion(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <form onSubmit={handleSendMessage} className="w-full flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Ask about your emissions data..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
                className="flex-1"
              />
              <Button type="submit" disabled={isProcessing || !input.trim()}>
                {isProcessing ? "Processing..." : <Send className="h-4 w-4" />}
              </Button>
              <Button type="button" variant="outline" onClick={startNewChat}>
                New Chat
              </Button>
            </form>
          </CardFooter>
        </TabsContent>

        <TabsContent value="results">
          <CardContent className="p-4 space-y-6">
            {queryResult && (
              <>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Summary</h3>
                  <p>{queryResult.summary}</p>
                </div>

                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    {getIntentIcon(queryResult.query.intent)}
                    {getIntentTitle(queryResult.query.intent)}
                  </h3>
                  <div className="h-[300px]">{renderVisualization()}</div>
                </div>

                {queryResult.data && queryResult.data.length > 0 && queryResult.query.intent !== "single_value" && (
                  <div>
                    <h3 className="font-medium mb-2">Data Details</h3>
                    {renderDataTable()}
                  </div>
                )}
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentTab("chat")}>
              Back to Chat
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Export data as CSV
                if (queryResult && queryResult.data) {
                  const headers = Object.keys(queryResult.data[0] || {}).join(",")
                  const rows = queryResult.data.map((row: any) =>
                    Object.values(row)
                      .map((value) => (typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value))
                      .join(","),
                  )
                  const csv = [headers, ...rows].join("\n")
                  const blob = new Blob([csv], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "emission_data_export.csv"
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                }
              }}
            >
              Export Data
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// Helper function to get icon based on query intent
function getIntentIcon(intent?: QueryIntent) {
  switch (intent) {
    case "single_value":
      return <BarChart2 className="h-5 w-5" />
    case "time_series":
      return <TrendingUp className="h-5 w-5" />
    case "breakdown":
      return <PieChart className="h-5 w-5" />
    case "comparison":
      return <ArrowUpRight className="h-5 w-5" />
    case "ranking":
      return <BarChart2 className="h-5 w-5" />
    case "prediction":
      return <TrendingUp className="h-5 w-5" />
    default:
      return <BarChart2 className="h-5 w-5" />
  }
}

// Helper function to get title based on query intent
function getIntentTitle(intent?: QueryIntent) {
  switch (intent) {
    case "single_value":
      return "Emissions Value"
    case "time_series":
      return "Emissions Over Time"
    case "breakdown":
      return "Emissions Breakdown"
    case "comparison":
      return "Emissions Comparison"
    case "ranking":
      return "Top Emission Sources"
    case "prediction":
      return "Emissions Forecast"
    default:
      return "Emissions Data"
  }
}

type QueryIntent = "single_value" | "time_series" | "breakdown" | "comparison" | "ranking" | "prediction"

