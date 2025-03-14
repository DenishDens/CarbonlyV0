import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase"
import { ConversationList } from "@/components/ai-assistant/conversation-list"

export const metadata: Metadata = {
  title: "AI Assistant - Carbonly",
  description: "Get insights and recommendations from CarbonlyAI",
}

export default async function AIAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  // Get conversations if user is logged in
  let conversations = []
  if (user) {
    const { data, error } = await supabase
      .from("ai_conversations")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (!error) {
      conversations = data
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-64 border-r h-full">
        <ConversationList conversations={conversations} />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

