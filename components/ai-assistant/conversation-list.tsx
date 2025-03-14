"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageSquare, Plus } from "lucide-react"
import { format } from "date-fns"

interface Conversation {
  id: string
  title: string
  updated_at: string
}

interface ConversationListProps {
  conversations: Conversation[]
}

export function ConversationList({ conversations }: ConversationListProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Link href="/dashboard/ai-assistant/new">
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <Link key={conversation.id} href={`/dashboard/ai-assistant/${conversation.id}`}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left h-auto py-3",
                      pathname === `/dashboard/ai-assistant/${conversation.id}` ? "bg-muted" : "bg-transparent",
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium truncate w-full">{conversation.title}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {format(new Date(conversation.updated_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

