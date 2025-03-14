import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectTabs } from "@/components/projects/project-tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  return (
    <>
      <div className="flex-1 space-y-6 p-6">
        <Suspense fallback={<ProjectHeaderSkeleton />}>
          <ProjectHeaderWrapper projectId={params.id} />
        </Suspense>

        <Suspense fallback={<ProjectTabsSkeleton />}>
          <ProjectTabs projectId={params.id} />
        </Suspense>
      </div>
    </>
  )
}

async function ProjectHeaderWrapper({ projectId }: { projectId: string }) {
  if (projectId === "new") {
    return <DashboardHeader heading="Create New Project" text="Set up a new carbon emission tracking project" />
  }

  const supabase = createServerSupabaseClient()

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      business_units(*),
      organizations(*)
    `)
    .eq("id", projectId)
    .single()

  if (error || !project) {
    notFound()
  }

  return <ProjectHeader project={project} />
}

function ProjectHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[350px]" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
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

