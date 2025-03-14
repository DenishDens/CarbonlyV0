export type PredefinedQuestion = {
  id: string
  text: string
  description?: string
  category: "emissions" | "projects" | "analysis" | "recommendations"
}

export type AIAssistantMessage = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export type AIAssistantConversation = {
  id: string
  title: string
  messages: AIAssistantMessage[]
  createdAt: Date
  updatedAt: Date
  userId: string
  projectId?: string
}

