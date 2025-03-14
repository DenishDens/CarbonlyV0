"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ProjectSettingsProps {
  project: any
  isOwner: boolean
  isNew?: boolean
}

export function ProjectSettings({ project, isOwner, isNew = false }: ProjectSettingsProps) {
  const router = useRouter()
  const [name, setName] = useState(project?.name || "")
  const [description, setDescription] = useState(project?.description || "")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    isPublic: project?.is_public || false,
    notificationsEnabled: project?.notifications_enabled || true,
    reportFrequency: project?.report_frequency || "monthly",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isNew) {
        // Create new project
        const { data, error } = await supabase
          .from("projects")
          .insert({
            name: formData.name,
            description: formData.description,
            is_public: formData.isPublic,
            notifications_enabled: formData.notificationsEnabled,
            report_frequency: formData.reportFrequency,
            // Add any other required fields
          })
          .select()

        if (error) throw error

        toast.success("Project created successfully")

        // Redirect to the new project page
        if (data && data[0]) {
          router.push(`/dashboard/projects/${data[0].id}`)
        }
      } else {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update({
            name: formData.name,
            description: formData.description,
            is_public: formData.isPublic,
            notifications_enabled: formData.notificationsEnabled,
            report_frequency: formData.reportFrequency,
            // Add any other fields to update
          })
          .eq("id", project.id)

        if (error) throw error

        toast.success("Project settings updated successfully")
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save project settings")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!project && !isNew) {
    return <div>Project not found</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "Create New Project" : "General Settings"}</CardTitle>
            <CardDescription>
              {isNew
                ? "Enter the details for your new project"
                : "Manage your project's basic information and settings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} disabled={!isOwner} name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!isOwner}
                name="description"
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPublic">Public Project</Label>
                <p className="text-sm text-muted-foreground">Make this project visible to all organization members</p>
              </div>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {!isNew && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive updates about this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notificationsEnabled">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates about project changes</p>
                  </div>
                  <Switch
                    id="notificationsEnabled"
                    checked={formData.notificationsEnabled}
                    onCheckedChange={(checked) => handleSwitchChange("notificationsEnabled", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportFrequency">Report Frequency</Label>
                  <select
                    id="reportFrequency"
                    name="reportFrequency"
                    value={formData.reportFrequency}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reportFrequency: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border border-destructive/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-destructive">Archive Project</h4>
                        <p className="text-sm text-muted-foreground">
                          This project will be archived and hidden from active projects.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        type="button"
                        className="text-destructive border-destructive/50 hover:bg-destructive/10"
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md border border-destructive p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-destructive">Delete Project</h4>
                        <p className="text-sm text-muted-foreground">
                          This action cannot be undone. All data will be permanently deleted.
                        </p>
                      </div>
                      <Button variant="destructive" type="button">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/projects")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !isOwner}>
            {isLoading ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ProjectSettings

