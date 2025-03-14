import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Edit, Settings, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Project {
  id: string
  name: string
  description?: string
  status: string
  created_at: string
  organization_id: string
  organizations?: {
    name: string
  }
  business_units?: {
    name: string
  }
}

interface ProjectHeaderProps {
  project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${project.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
        </div>

        <div className="flex items-center">
          <Building2 className="mr-1 h-4 w-4" />
          {project.organizations?.name || project.business_units?.name || "No organization"}
        </div>

        <StatusBadge status={project.status || "active"} />
      </div>

      {project.description && <p className="text-muted-foreground">{project.description}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

  switch (status.toLowerCase()) {
    case "active":
      variant = "default"
      break
    case "completed":
      variant = "secondary"
      break
    case "on-hold":
      variant = "outline"
      break
    case "cancelled":
      variant = "destructive"
      break
  }

  return <Badge variant={variant}>{status}</Badge>
}

