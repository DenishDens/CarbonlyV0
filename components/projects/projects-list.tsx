"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/supabase"
import { ProjectCard } from "./project-card"
import { EmptyState } from "@/components/ui/empty-state"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

type Project = Database["public"]["Views"]["projects_with_emissions"]["Row"]

interface ProjectsListProps {
  userId: string
  organizationId: string
}

export function ProjectsList({ userId, organizationId }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects_with_emissions")
          .select("*")
          .eq("organization_id", organizationId)
          .order("created_at", { ascending: false })

        if (projectsError) {
          setError("Failed to load projects")
          setLoading(false)
          return
        }

        setProjects(projectsData || [])
      } catch (err) {
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchProjects()
    }
  }, [supabase, organizationId, mounted])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={PlusCircle}
        title="No projects found"
        description={error}
        action={
          <Link href="/dashboard/settings">
            <Button>Create Organization</Button>
          </Link>
        }
      />
    )
  }

  if (!projects.length) {
    return (
      <EmptyState
        icon={PlusCircle}
        title="No projects found"
        description="Create your first project to get started"
        action={
          <Link href="/dashboard/projects/new">
            <Button>Create Project</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
