"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmissionDataManager } from "@/components/emission-data/emission-data-manager"
import { ProjectPartners } from "./project-partners"
import { ProjectSettings } from "./project-settings"
import { ProjectReports } from "@/components/reports/project-reports"
import { ProjectDashboard } from "./project-dashboard"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const supabase = createClient()

interface ProjectTabsProps {
  projectId: string
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const isNewProject = projectId === "new"

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)

        // If this is a new project, create an empty project object
        if (isNewProject) {
          setProject({
            id: "new",
            name: "",
            description: "",
            organization_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "draft",
          })
          setIsOwner(true)
          setLoading(false)
          setActiveTab("settings")
          return
        }

        // Fetch existing project data
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single()

        if (projectError) {
          throw new Error(projectError.message)
        }

        if (!projectData) {
          throw new Error("Project not found")
        }

        setProject(projectData)

        // Check if user is owner (simplified for now)
        setIsOwner(true)
      } catch (err: any) {
        console.error("Error fetching project:", err)
        setError(err.message || "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId, isNewProject])

  if (loading) {
    return <ProjectTabsSkeleton />
  }

  if (error && !isNewProject) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Failed to load project. Please try again."}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dashboard" disabled={isNewProject}>
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="emission-data" disabled={isNewProject}>
          Emission Data
        </TabsTrigger>
        <TabsTrigger value="partners" disabled={isNewProject}>
          Partners
        </TabsTrigger>
        <TabsTrigger value="reports" disabled={isNewProject}>
          Reports
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      {!isNewProject && (
        <TabsContent value="dashboard" className="space-y-4">
          <ProjectDashboard projectId={project.id} />
        </TabsContent>
      )}

      {!isNewProject && (
        <TabsContent value="emission-data" className="space-y-4">
          <EmissionDataManager projectId={project.id} />
        </TabsContent>
      )}

      {!isNewProject && (
        <TabsContent value="partners" className="space-y-4">
          <ProjectPartners project={project} isOwner={isOwner} />
        </TabsContent>
      )}

      {!isNewProject && (
        <TabsContent value="reports" className="space-y-4">
          <ProjectReports projectId={project.id} />
        </TabsContent>
      )}

      <TabsContent value="settings" className="space-y-4">
        <ProjectSettings project={project} isOwner={isOwner} isNew={isNewProject} />
      </TabsContent>
    </Tabs>
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

