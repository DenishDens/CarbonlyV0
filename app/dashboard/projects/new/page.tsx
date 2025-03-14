import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectTabs } from "@/components/projects/project-tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Add dynamic export to ensure server-side rendering
export const dynamic = "force-dynamic"

export default function NewProjectPage() {
  return (
    <>
      <DashboardHeader heading="Create New Project" text="Set up a new carbon emission tracking project." />
      <div className="flex flex-col gap-6 p-4 pt-6 md:p-8">
        <Suspense fallback={<ProjectTabsSkeleton />}>
          <ProjectTabs projectId="new" />
        </Suspense>
      </div>
    </>
  )
}

function ProjectTabsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}

