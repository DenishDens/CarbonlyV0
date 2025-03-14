import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase"
import { AIChat } from "@/components/ai-assistant/ai-chat"

interface ConversationPageProps {
  params: {
    id: string
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { id } = params
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    return notFound()
  }

  // Get the conversation
  const { data: conversation, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !conversation) {
    return notFound()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h1 className="text-xl font-bold truncate">{conversation.title}</h1>
        {conversation.project_id && <p className="text-sm text-muted-foreground">Project: {conversation.project_id}</p>}
      </div>

      <div className="flex-1 overflow-hidden">
        <AIChat
          conversationId={conversation.id}
          initialMessages={conversation.messages}
          projectId={conversation.project_id}
        />
      </div>
    </div>
  )
}

