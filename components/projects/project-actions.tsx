"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { MoreHorizontal, Edit, Trash, Plus } from "lucide-react"
import { deleteProject } from "@/lib/api/projects"
import type { ProjectType } from "@/types"

interface ProjectActionsProps {
  projectId: string
  projectType: ProjectType
}

export function ProjectActions({ projectId, projectType }: ProjectActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteProject(projectId)

      toast({
        title: `${projectType === "business_unit" ? "Business unit" : "Project"} deleted`,
        description: `The ${projectType === "business_unit" ? "business unit" : "project"} has been deleted successfully.`,
      })

      router.push("/dashboard/projects")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: `Failed to delete ${projectType === "business_unit" ? "business unit" : "project"}`,
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit {projectType === "business_unit" ? "Business Unit" : "Project"}
          </DropdownMenuItem>

          {projectType === "business_unit" && (
            <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/new?type=project&parentId=${projectId}`)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project to Business Unit
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete {projectType === "business_unit" ? "Business Unit" : "Project"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this {projectType === "business_unit" ? "business unit" : "project"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {projectType === "business_unit"
                ? "This will remove the business unit and unlink all associated projects. The projects themselves will not be deleted."
                : "This action cannot be undone. This will permanently delete the project and all its data."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

