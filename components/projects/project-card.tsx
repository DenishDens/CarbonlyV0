"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, BarChart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Database } from "@/types/supabase"
import { useEffect, useState } from "react"

type Project = Database["public"]["Views"]["projects_with_emissions"]["Row"]

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="overflow-hidden h-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-4 mt-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-4 mt-2"></div>
          <div className="h-20 bg-gray-200 rounded mx-4 mt-4"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden h-full">
      <Link href={`/dashboard/projects/${project.id}`} className="block h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <StatusBadge status={project.status} />
          </div>
          <CardDescription className="line-clamp-1">
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description || "No description provided"}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t p-4 mt-auto">
          <div className="flex items-center text-sm text-muted-foreground w-full">
            <Building2 className="mr-1 h-4 w-4" />
            {project.organization_name || "No organization"}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center text-sm text-muted-foreground">
              <BarChart className="mr-1 h-4 w-4" />
              <span className="font-medium">Total: {project.total_emissions.toFixed(2)} tCO₂e</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>Scope 1: {project.scope1_emissions.toFixed(2)}</div>
              <div>Scope 2: {project.scope2_emissions.toFixed(2)}</div>
              <div>Scope 3: {project.scope3_emissions.toFixed(2)}</div>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

  switch (status.toLowerCase()) {
    case "draft":
      variant = "outline"
      break
    case "in_progress":
      variant = "default"
      break
    case "completed":
      variant = "secondary"
      break
    case "archived":
      variant = "destructive"
      break
  }

  return <Badge variant={variant}>{status}</Badge>
}

