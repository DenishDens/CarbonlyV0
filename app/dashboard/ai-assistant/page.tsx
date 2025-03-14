import { AIChat } from "@/components/ai-chat/ai-chat"

export const metadata = {
  title: "AI Assistant - Carbonly.ai",
  description: "Ask questions about your carbon emissions data in natural language",
}

export default function AIAssistantPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">AI Emissions Assistant</h1>
      <p className="text-muted-foreground mb-6">
        Ask questions about your emissions data in natural language. The AI assistant can help you analyze trends,
        compare time periods, and break down emissions by material type, category, or organizational unit.
      </p>
      <AIChat />
    </div>
  )
}

