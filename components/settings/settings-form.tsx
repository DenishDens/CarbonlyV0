"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
})

const organizationFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [organization, setOrganization] = useState<any>(null)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    },
  })

  const organizationForm = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      organizationName: "",
      industry: "",
    },
  })

  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        setUser(user)

        // Get user profile
        const { data: profiles } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profiles) {
          profileForm.reset({
            name: profiles.full_name || "",
            email: user.email || "",
            bio: profiles.bio || "",
          })
        }

        // Get user's organization
        const { data: orgMembers } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .single()

        if (orgMembers) {
          const { data: org } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", orgMembers.organization_id)
            .single()

          if (org) {
            setOrganization(org)
            organizationForm.reset({
              organizationName: org.name || "",
              industry: org.industry || "",
            })
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    loadUserData()
  }, [profileForm, organizationForm])

  async function onProfileSubmit(data: ProfileFormValues) {
    if (!user) return

    setIsLoading(true)

    try {
      // Update profile
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: data.name,
        bio: data.bio,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onOrganizationSubmit(data: OrganizationFormValues) {
    if (!organization) return

    setIsLoading(true)

    try {
      // Update organization
      const { error } = await supabase
        .from("organizations")
        .update({
          name: data.organizationName,
          industry: data.industry,
          updated_at: new Date().toISOString(),
        })
        .eq("id", organization.id)

      if (error) throw error

      toast({
        title: "Organization updated",
        description: "Your organization settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating organization:", error)
      toast({
        title: "Error",
        description: "Failed to update organization. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} disabled />
                    </FormControl>
                    <FormDescription>Email cannot be changed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little about yourself" className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Brief description for your profile. Max 160 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Update your organization settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...organizationForm}>
            <form onSubmit={organizationForm.handleSubmit(onOrganizationSubmit)} className="space-y-4">
              <FormField
                control={organizationForm.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={organizationForm.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Your industry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Organization"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

