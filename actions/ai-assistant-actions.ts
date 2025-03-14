"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Define types
interface AIAssistantConversation {
  id: string
  title: string
  messages: AIAssistantMessage[]
  userId: string
  projectId?: string
  createdAt: Date
  updatedAt: Date
}

interface AIAssistantMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface PredefinedQuestion {
  id: string
  text: string
  description: string
  category: string
}

// Function to check if user has access to a project
async function hasProjectAccess(userId: string, projectId: string) {
  const supabase = createServerSupabaseClient()

  // First check if user is directly part of the organization that owns the project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("organization_id")
    .eq("id", projectId)
    .single()

  if (projectError) {
    console.error("Error fetching project:", projectError)
    return false
  }

  // Check if user belongs to the organization
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", userId)
    .single()

  if (userError) {
    console.error("Error fetching user:", userError)
    return false
  }

  // Direct organization access
  if (user.organization_id === project.organization_id) {
    return true
  }

  // Check if user's organization is a partner in this project (joint venture)
  const { data: partnerOrgs, error: partnerError } = await supabase
    .from("project_partners")
    .select("partner_organization_id")
    .eq("project_id", projectId)
    .eq("status", "active")

  if (partnerError) {
    console.error("Error fetching project partners:", partnerError)
    return false
  }

  // Check if user's organization is in the partner list
  return partnerOrgs.some((partner) => partner.partner_organization_id === user.organization_id)
}

// Function to get project emission data
async function getProjectEmissionData(projectId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("emission_data").select("*").eq("project_id", projectId)

  if (error) {
    console.error("Error fetching emission data:", error)
    return []
  }

  return data
}

// Function to get emission factors
async function getEmissionFactors() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("emission_factors").select("*")

  if (error) {
    console.error("Error fetching emission factors:", error)
    return []
  }

  return data
}

// Function to get project details
async function getProjectDetails(projectId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      organization:organizations(name),
      partners:project_partners(
        partner_organization:organizations(name)
      )
    `)
    .eq("id", projectId)
    .single()

  if (error) {
    console.error("Error fetching project details:", error)
    return null
  }

  return data
}

// Function to save conversation
export async function saveConversation(conversation: Omit<AIAssistantConversation, "id" | "createdAt" | "updatedAt">) {
  const supabase = createServerSupabaseClient()

  // Check if user has access to the project if projectId is provided
  if (conversation.projectId) {
    const hasAccess = await hasProjectAccess(conversation.userId, conversation.projectId)
    if (!hasAccess) {
      throw new Error("You do not have access to this project")
    }
  }

  const { data, error } = await supabase
    .from("ai_conversations")
    .insert({
      title: conversation.title,
      messages: conversation.messages,
      user_id: conversation.userId,
      project_id: conversation.projectId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving conversation:", error)
    throw new Error("Failed to save conversation")
  }

  revalidatePath("/dashboard/ai-assistant")
  return data
}

// Function to get conversations
export async function getConversations(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching conversations:", error)
    throw new Error("Failed to fetch conversations")
  }

  return data
}

// Function to get a single conversation
export async function getConversation(conversationId: string, userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching conversation:", error)
    throw new Error("Failed to fetch conversation")
  }

  // If conversation has a project, check access
  if (data.project_id) {
    const hasAccess = await hasProjectAccess(userId, data.project_id)
    if (!hasAccess) {
      throw new Error("You do not have access to this conversation")
    }
  }

  return data
}

// Function to add message to conversation
export async function addMessageToConversation(
  conversationId: string,
  message: Omit<AIAssistantMessage, "id" | "timestamp">,
  userId: string,
) {
  const supabase = createServerSupabaseClient()

  // Get the conversation first
  const { data: conversation, error: convError } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single()

  if (convError) {
    console.error("Error fetching conversation:", convError)
    throw new Error("Failed to fetch conversation")
  }

  // Check project access if needed
  if (conversation.project_id) {
    const hasAccess = await hasProjectAccess(userId, conversation.project_id)
    if (!hasAccess) {
      throw new Error("You do not have access to this conversation")
    }
  }

  // Add the message
  const newMessage = {
    id: crypto.randomUUID(),
    ...message,
    timestamp: new Date(),
  }

  const messages = [...conversation.messages, newMessage]

  // Update the conversation
  const { error: updateError } = await supabase
    .from("ai_conversations")
    .update({
      messages,
      updated_at: new Date(),
    })
    .eq("id", conversationId)

  if (updateError) {
    console.error("Error updating conversation:", updateError)
    throw new Error("Failed to update conversation")
  }

  revalidatePath(`/dashboard/ai-assistant/${conversationId}`)
  return newMessage
}

// Function to generate AI response
export async function generateAIResponse(conversationId: string, projectId: string | undefined, userId: string) {
  const supabase = createServerSupabaseClient()

  // Get the conversation
  const { data: conversation, error: convError } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single()

  if (convError) {
    console.error("Error fetching conversation:", convError)
    throw new Error("Failed to fetch conversation")
  }

  // Check project access if needed
  if (conversation.project_id) {
    const hasAccess = await hasProjectAccess(userId, conversation.project_id)
    if (!hasAccess) {
      throw new Error("You do not have access to this conversation")
    }
  }

  // Get the last user message
  const messages = conversation.messages
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")

  if (!lastUserMessage) {
    throw new Error("No user message found")
  }

  // Prepare context for the AI
  let context = ""

  if (projectId) {
    // Get project details
    const projectDetails = await getProjectDetails(projectId)

    // Get emission data for the project
    const emissionData = await getProjectEmissionData(projectId)

    // Format the data for the AI
    context = `
      Project Information:
      Name: ${projectDetails?.name}
      Description: ${projectDetails?.description || "No description"}
      Organization: ${projectDetails?.organization?.name}
      Joint Venture: ${projectDetails?.is_joint_venture ? "Yes" : "No"}
      Partners: ${projectDetails?.partners?.map((p) => p.partner_organization?.name).join(", ") || "None"}
      
      Emission Data Summary:
      Total Records: ${emissionData.length}
      Categories: ${[...new Set(emissionData.map((d) => d.category))].join(", ")}
      Total Emissions: ${emissionData.reduce((sum, d) => sum + d.total_emissions, 0).toFixed(2)} kg CO2e
      
      Detailed Emission Data:
      ${emissionData
        .map(
          (d) => `
        Category: ${d.category}
        Subcategory: ${d.subcategory || "N/A"}
        Material: ${d.material || "N/A"}
        Quantity: ${d.quantity} ${d.unit}
        Emission Factor: ${d.emission_factor}
        Total Emissions: ${d.total_emissions} kg CO2e
        Data Source: ${d.data_source || "Manual Entry"}
      `,
        )
        .join("\n")}
    `
  }

  // Generate AI response
  try {
    const systemPrompt = `
      You are CarbonlyAI, an assistant specialized in carbon emissions analysis and sustainability.
      You help users understand their carbon footprint, analyze emission data, and provide recommendations for reduction.
      
      When answering questions:
      1. Be concise and informative
      2. Provide specific insights based on the data provided
      3. Suggest actionable recommendations when appropriate
      4. Use facts and data to support your answers
      5. If you don't have enough information, ask clarifying questions
      
      ${context ? "Here is the context about the project and its emission data:\n" + context : ""}
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: lastUserMessage.content,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Add the AI response to the conversation
    const aiMessage = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content: text,
      timestamp: new Date(),
    }

    // Update the conversation
    const { error: updateError } = await supabase
      .from("ai_conversations")
      .update({
        messages: [...conversation.messages, aiMessage],
        updated_at: new Date(),
      })
      .eq("id", conversationId)

    if (updateError) {
      console.error("Error updating conversation:", updateError)
      throw new Error("Failed to update conversation")
    }

    revalidatePath(`/dashboard/ai-assistant/${conversationId}`)
    return aiMessage
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate AI response")
  }
}

// Function to get predefined questions - Changed from synchronous to async
export async function getPredefinedQuestions(): Promise<PredefinedQuestion[]> {
  return [
    {
      id: "emissions-summary",
      text: "Summarize the total emissions for this project",
      description: "Get a quick overview of the total emissions and main contributors",
      category: "emissions",
    },
    {
      id: "category-breakdown",
      text: "Break down emissions by category",
      description: "See which categories contribute most to your carbon footprint",
      category: "emissions",
    },
    {
      id: "reduction-opportunities",
      text: "What are the top opportunities for emission reduction?",
      description: "Identify areas where you can make the biggest impact",
      category: "recommendations",
    },
    {
      id: "compare-industry",
      text: "How do these emissions compare to industry standards?",
      description: "See how your project compares to similar projects in your industry",
      category: "analysis",
    },
    {
      id: "material-analysis",
      text: "Which materials contribute most to our emissions?",
      description: "Analyze the impact of different materials on your carbon footprint",
      category: "analysis",
    },
    {
      id: "data-quality",
      text: "Assess the quality of our emission data",
      description: "Get insights on data completeness and reliability",
      category: "analysis",
    },
    {
      id: "reduction-targets",
      text: "Suggest emission reduction targets",
      description: "Get recommendations for realistic reduction goals",
      category: "recommendations",
    },
    {
      id: "partner-contributions",
      text: "How much do joint venture partners contribute to emissions?",
      description: "Analyze emissions by partner organization",
      category: "projects",
    },
  ]
}

