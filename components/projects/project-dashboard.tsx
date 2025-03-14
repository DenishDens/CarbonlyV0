"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Building,
  Calendar,
  Clock,
  Download,
  FileUp,
  Settings,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react"
import { logger } from "@/lib/logger"
import { supabase } from "@/lib/supabase/client"
import { Project } from "@/types/supabase"
import { Spinner } from "@/components/ui/spinner"

interface ProjectDashboardProps {
  projectId: string
}

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjectData() {
      try {
        logger.info("ProjectDashboard", "Fetching project data", { projectId })
        setLoading(true)
        
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single()

        if (error) {
          logger.error("ProjectDashboard", "Failed to fetch project", {
            projectId,
            error: error.message
          })
          setError(error.message)
          return
        }

        if (!data) {
          logger.warn("ProjectDashboard", "Project not found", { projectId })
          setError("Project not found")
          return
        }

        logger.info("ProjectDashboard", "Project data fetched successfully", {
          projectId,
          projectName: data.name
        })
        setProject(data)
      } catch (error) {
        logger.error("ProjectDashboard", "Unexpected error fetching project", {
          projectId,
          error: error instanceof Error ? error.message : String(error)
        })
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [projectId])

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!project) {
    return <div>No project data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Emissions</CardTitle>
            <CardDescription>Overall carbon footprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{project.total_emissions?.toFixed(2) || 0} tCO₂e</p>
                {project.emissions_change && (
                  <div className="flex items-center mt-1">
                    {project.emissions_change > 0 ? (
                      <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={project.emissions_change > 0 ? "text-red-500" : "text-green-500"}>
                      {Math.abs(project.emissions_change)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Active contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{project.team_members?.length || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Active members</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Updated</CardTitle>
            <CardDescription>Recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : "Never"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Last update</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emissions Trend</CardTitle>
          <CardDescription>Monthly carbon emissions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Emissions trend chart would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            {project.recent_activity?.length > 0 ? (
              <div className="space-y-4">
                {project.recent_activity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <activity.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Project contributors</CardDescription>
          </CardHeader>
          <CardContent>
            {project.team_members?.length > 0 ? (
              <div className="space-y-4">
                {project.team_members.map((member: any) => (
                  <div key={member.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No team members</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 