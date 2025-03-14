"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Send, X, Minimize2, ChevronUp } from "lucide-react"

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState("")

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center z-50"
      >
        <Brain className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div
      className={`fixed ${isMinimized ? "bottom-6 right-6 w-auto" : "bottom-6 right-6 w-80 md:w-96"} z-50 transition-all duration-200 ease-in-out`}
    >
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="shadow-xl border-gray-200">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-green-600 text-white rounded-t-lg">
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              <CardTitle className="text-base">AI Assistant</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-green-700 rounded-full"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-green-700 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 bg-gray-50 h-64 overflow-y-auto">
            <div className="text-center py-4">
              <p>How can I help you with carbon emissions today?</p>
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-green-600 hover:bg-green-700 px-3" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

