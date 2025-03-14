import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"
import { AIChat } from "@/components/assistant/ai-chat"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function AssistantPage() {
  return (
    <>
      <DashboardHeader heading="AI Assistant" text="Get help and insights from our AI assistant." />
      <div className="flex-1 p-4 pt-6 md:p-8">
        <Suspense fallback={<AIChatSkeleton />}>
          <AIChat />
        </Suspense>
      </div>
    </>
  )
}

function AIChatSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <Skeleton className="h-[calc(100%-4rem)] w-full mb-4" />
      <Skeleton className="h-16 w-full" />
    </div>
  )
}

