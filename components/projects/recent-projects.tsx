import type { ProjectStatus, ProjectType } from "@/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Building2, Briefcase } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  progress: number
  project_type: ProjectType
  updated_at: string
}

interface RecentProjectsProps {
  projects: Project[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant={
                    project.status === "completed"
                      ? "default"
                      : project.status === "in-progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {project.status === "in-progress"
                    ? "In Progress"
                    : project.status === "completed"
                      ? "Completed"
                      : "Draft"}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  {project.project_type === "business_unit" ? (
                    <>
                      <Building2 className="mr-1 h-4 w-4" />
                      <span>Business Unit</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="mr-1 h-4 w-4" />
                      <span>Project</span>
                    </>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{project.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {project.description || "No description provided."}
              </p>
              <div className="flex items-center gap-2">
                <Progress value={project.progress} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground">{project.progress}%</span>
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4 border-t bg-muted/50">
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(project.updated_at).toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

