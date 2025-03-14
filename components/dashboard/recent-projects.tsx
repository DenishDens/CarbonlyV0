"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Plus } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  lastUpdated: string
  emissions: number
  change: number
}

interface RecentProjectsProps {
  className?: string
  projects?: Project[]
}

export function RecentProjects({
  className,
  projects = [
    {
      id: "1",
      name: "Headquarters",
      description: "Main office operations",
      status: "active",
      lastUpdated: "2 days ago",
      emissions: 125.4,
      change: -5.2,
    },
    {
      id: "2",
      name: "Manufacturing Plant",
      description: "Production facility",
      status: "active",
      lastUpdated: "1 day ago",
      emissions: 342.8,
      change: 2.1,
    },
    {
      id: "3",
      name: "Distribution Center",
      description: "Logistics hub",
      status: "on-hold",
      lastUpdated: "5 days ago",
      emissions: 98.6,
      change: -1.8,
    },
    {
      id: "4",
      name: "Office Renovation",
      description: "Green building upgrade",
      status: "completed",
      lastUpdated: "1 week ago",
      emissions: 45.2,
      change: -12.5,
    },
  ],
}: RecentProjectsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Monitor your active and recent projects</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/projects">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="flex items-start space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="rounded-md bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium leading-none">{project.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${project.change < 0 ? "text-green-500" : "text-red-500"}`}>
                      {project.change < 0 ? "↓" : "↑"} {Math.abs(project.change)}%
                    </span>
                    <span className="font-medium">{project.emissions} tCO₂e</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      project.status === "active" ? "default" : project.status === "completed" ? "outline" : "secondary"
                    }
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Updated {project.lastUpdated}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Button asChild variant="outline" size="sm" className="mt-4 w-full">
          <Link href="/dashboard/projects" className="flex items-center justify-center">
            View all projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

