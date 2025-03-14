"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createProject } from "@/lib/api/projects"
import type { ProjectType } from "@/types"

const projectFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50, { message: "Name must not exceed 50 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, { message: "Description must not exceed 500 characters." }),
  projectType: z
    .enum(["business_unit", "project"], {
      required_error: "Please select a project type.",
    }),
  parentId: z.string().optional(),
  organizationId: z.string({
    required_error: "Organization ID is required.",
  }),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface BusinessUnit {
  id: string
  name: string
}

interface NewProjectFormProps {
  organizationId: string
  onSuccess?: () => void
}

export function NewProjectForm({ organizationId, onSuccess }: NewProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      projectType: "project",
      organizationId,
    },
  })

  async function onSubmit(data: ProjectFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const project = await response.json()
      toast("Project created successfully")
      router.refresh()
      onSuccess?.()
    } catch (error) {
      toast("Failed to create project", {
        description: "An error occurred while creating the project. Please try again."
      })
      console.error("Error creating project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter project description"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about the project's goals and scope.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="business_unit">Business Unit</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose whether this is a business unit or a project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </Form>
  )
}

