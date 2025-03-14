"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Building,
  Calendar,
  ChevronLeft,
  Globe,
  Info,
  Loader2,
  MapPin,
  Save,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react"

interface ProjectSettingsProps {
  projectId: string
}

export default function ProjectSettings({ projectId }: ProjectSettingsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, string>>({
    onedrive: "disconnected",
    googledrive: "disconnected",
    xero: "disconnected",
    myob: "disconnected",
    jotform: "disconnected",
  })
  const [connectingService, setConnectingService] = useState<string | null>(null)
  const [jointVenturePartners, setJointVenturePartners] = useState<any[]>([
    {
      id: "partner-1",
      name: "Partner Organization A",
      email: "contact@partnera.com",
      ownership: 30,
      status: "active",
    },
    {
      id: "partner-2",
      name: "Partner Organization B",
      email: "contact@partnerb.com",
      ownership: 20,
      status: "pending",
    },
  ])
  const [isJointVentureDialogOpen, setIsJointVentureDialogOpen] = useState(false)
  const [newPartner, setNewPartner] = useState({ name: "", email: "", ownership: 10, role: "contributor" })

  const handleConnect = async (service: string) => {
    setConnectingService(service)

    // Simulate API connection process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIntegrationStatus((prev) => ({
      ...prev,
      [service]: prev[service] === "connected" ? "disconnected" : "connected",
    }))

    setConnectingService(null)
  }

  const addJointVenturePartner = (partner: any) => {
    setJointVenturePartners((prev) => [
      ...prev,
      {
        ...partner,
        id: `partner-${prev.length + 1}`,
        status: "pending",
      },
    ])
  }

  const removeJointVenturePartner = (partnerId: string) => {
    setJointVenturePartners((prev) => prev.filter((partner) => partner.id !== partnerId))
  }

  const updatePartnerOwnership = (partnerId: string, ownership: number) => {
    setJointVenturePartners((prev) =>
      prev.map((partner) => (partner.id === partnerId ? { ...partner, ownership } : partner)),
    )
  }

  // Mock data - in a real app, this would come from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Check if it's a business unit or project
      const isBusinessUnit = ["1", "2", "3"].includes(projectId)

      if (isBusinessUnit) {
        setProject({
          id: projectId,
          name: projectId === "1" ? "Headquarters" : projectId === "2" ? "Manufacturing Plant A" : "Retail Stores",
          type: "Business Unit",
          description:
            projectId === "1"
              ? "Main corporate office and administrative facilities"
              : projectId === "2"
                ? "Primary manufacturing facility for product lines A and B"
                : "All retail locations across North America",
          status: projectId === "3" ? "draft" : "active",
          location: projectId === "1" ? "San Francisco, CA" : projectId === "2" ? "Detroit, MI" : "Multiple Locations",
          address:
            projectId === "1"
              ? "123 Main St, San Francisco, CA 94105"
              : projectId === "2"
                ? "456 Factory Blvd, Detroit, MI 48201"
                : "Multiple Locations",
          code: projectId === "1" ? "HQ-001" : projectId === "2" ? "MFG-001" : "RET-001",
          website: projectId === "1" ? "https://example.com/hq" : "",
          createdAt: "2023-01-15T10:30:00Z",
          updatedAt: "2023-04-15T10:30:00Z",
          members: [
            {
              id: 1,
              name: "John Doe",
              email: "john@example.com",
              role: "Admin",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "JD",
            },
            {
              id: 2,
              name: "Jane Smith",
              email: "jane@example.com",
              role: "Editor",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "JS",
            },
          ],
          notifications: {
            emailReports: true,
            emissionAlerts: true,
            memberChanges: false,
            dataUploads: true,
          },
          integrations: {
            api: true,
            slack: false,
            teams: false,
            email: true,
          },
        })
      } else {
        // It's a project
        setProject({
          id: projectId,
          name:
            projectId === "4"
              ? "Supply Chain Analysis"
              : projectId === "5"
                ? "Carbon Reduction Initiative"
                : "Renewable Energy Transition",
          type: "Project",
          description:
            projectId === "4"
              ? "Analyzing Scope 3 emissions across our supply chain"
              : projectId === "5"
                ? "Company-wide initiative to reduce carbon emissions by 30% by 2025"
                : "Project to transition facilities to renewable energy sources",
          status: projectId === "6" ? "draft" : "active",
          relatedBusinessUnit:
            projectId === "4" ? "Headquarters" : projectId === "5" ? "All Business Units" : "Manufacturing Plant A",
          relatedBusinessUnitId: projectId === "4" ? "1" : projectId === "5" ? "all" : "2",
          code: projectId === "4" ? "PRJ-001" : projectId === "5" ? "PRJ-002" : "PRJ-003",
          createdAt: "2023-02-10T14:30:00Z",
          updatedAt: "2023-04-05T09:15:00Z",
          members: [
            {
              id: 1,
              name: "John Doe",
              email: "john@example.com",
              role: "Admin",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "JD",
            },
            {
              id: 3,
              name: "Robert Johnson",
              email: "robert@partner.com",
              role: "Viewer",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "RJ",
            },
          ],
          notifications: {
            emailReports: true,
            emissionAlerts: true,
            memberChanges: true,
            dataUploads: false,
          },
          integrations: {
            api: false,
            slack: true,
            teams: false,
            email: true,
          },
        })
      }

      setLoading(false)
    }, 800)
  }, [projectId])

  const handleSaveChanges = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    // In a real app, you would save the changes to the API
  }

  const handleDeleteProject = async () => {
    setIsDeleteDialogOpen(false)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Redirect to projects page
    router.push("/dashboard/projects")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project settings...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
        <p className="text-gray-600 mb-6">
          The project or business unit you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <a href="/dashboard/projects">Back to Projects</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.name} Settings</h1>
            <p className="text-gray-500">
              {project.type} • {project.status === "active" ? "Active" : "Draft"}
            </p>
          </div>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveChanges} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="joint-venture">Joint Venture</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about your {project.type.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={project.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Project Code</Label>
                    <Input id="code" defaultValue={project.code} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={3} defaultValue={project.description} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={project.status}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {project.type === "Project" && (
                    <div className="space-y-2">
                      <Label htmlFor="business-unit">Related Business Unit</Label>
                      <Select defaultValue={project.relatedBusinessUnitId}>
                        <SelectTrigger id="business-unit">
                          <SelectValue placeholder="Select business unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Headquarters</SelectItem>
                          <SelectItem value="2">Manufacturing Plant A</SelectItem>
                          <SelectItem value="3">Retail Stores</SelectItem>
                          <SelectItem value="all">All Business Units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {project.type === "Business Unit" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" rows={2} defaultValue={project.address} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="flex">
                          <div className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
                            <MapPin className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input id="location" defaultValue={project.location} className="rounded-l-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="flex">
                          <div className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
                            <Globe className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input id="website" defaultValue={project.website} className="rounded-l-none" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Project Information</h3>
                      <p className="text-sm text-gray-500">
                        Additional details about this {project.type.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 rounded-lg border border-gray-100">
                      <div className="mr-3 bg-gray-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Created</p>
                        <p className="text-sm text-gray-500">{formatDate(project.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-lg border border-gray-100">
                      <div className="mr-3 bg-gray-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-500">{formatDate(project.updatedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-lg border border-gray-100">
                      <div className="mr-3 bg-gray-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Team Members</p>
                        <p className="text-sm text-gray-500">{project.members.length} members</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-lg border border-gray-100">
                      <div className="mr-3 bg-gray-100 p-2 rounded-full">
                        <Building className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Type</p>
                        <p className="text-sm text-gray-500">{project.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage team members and their access permissions for this {project.type.toLowerCase()}
                </CardDescription>
              </div>
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>Invite a new user to collaborate on {project.name}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input id="email" type="email" placeholder="user@example.com" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <Select>
                        <SelectTrigger id="role" className="col-span-3">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="message" className="text-right pt-2">
                        Message
                      </Label>
                      <Textarea id="message" placeholder="Optional message" className="col-span-3" rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsInviteDialogOpen(false)}>
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.members.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        className={
                          member.role === "Admin"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100 mr-4"
                            : member.role === "Editor"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100 mr-4"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100 mr-4"
                        }
                      >
                        {member.role}
                      </Badge>
                      <Select defaultValue={member.role}>
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Change role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications for this {project.type.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-reports">Weekly Reports</Label>
                        <p className="text-sm text-gray-500">
                          Receive a weekly summary of emissions for this {project.type.toLowerCase()}
                        </p>
                      </div>
                      <Switch id="email-reports" checked={project.notifications.emailReports} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emission-alerts">Emission Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Get notified when emissions exceed predefined thresholds
                        </p>
                      </div>
                      <Switch id="emission-alerts" checked={project.notifications.emissionAlerts} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="member-changes">Team Member Changes</Label>
                        <p className="text-sm text-gray-500">Get notified when team members are added or removed</p>
                      </div>
                      <Switch id="member-changes" checked={project.notifications.memberChanges} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-uploads">Data Uploads</Label>
                        <p className="text-sm text-gray-500">Get notified when new data is uploaded and processed</p>
                      </div>
                      <Switch id="data-uploads" checked={project.notifications.dataUploads} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Notification Recipients</h3>
                      <p className="text-sm text-gray-500">
                        Select which team members receive notifications for this {project.type.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {project.members.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <Switch defaultChecked={member.role === "Admin"} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect this {project.type.toLowerCase()} with other services and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Third-Party Integrations</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to external services to import emission data directly into your project.
                  </p>

                  {/* OneDrive Integration */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="mr-4 bg-blue-100 p-2 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-700"
                        >
                          <path d="M9.5 13.5C11.2 9.4 15.1 9.3 16.7 13.3C19.1 13.9 20.6 16.5 19.9 18.9C19.3 21.3 16.7 22.8 14.3 22.1C14.1 22.1 14 22 13.8 22H7.5C4.5 22 2 19.5 2 16.5C2 13.7 4.1 11.4 6.8 11C7.1 11 7.4 11 7.7 11.1C8.1 10 8.8 9 9.5 8.3" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Microsoft OneDrive</h4>
                        <p className="text-sm text-muted-foreground">
                          Import spreadsheets and data files from OneDrive
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={integrationStatus.onedrive === "connected" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => handleConnect("onedrive")}
                      disabled={connectingService !== null}
                    >
                      {connectingService === "onedrive" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : integrationStatus.onedrive === "connected" ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                          </svg>
                          Disconnect
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 15v4a2 2 0 0 0 2 2h16v-4" />
                            <path d="M18 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M18 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          </svg>
                          Connect
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Google Drive Integration */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="mr-4 bg-red-100 p-2 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-700"
                        >
                          <path d="M9 18L2 9 9 2" />
                          <path d="M22 9L15 2" />
                          <path d="M3 9H21" />
                          <path d="M15 18L22 9" />
                          <path d="M9 18H15" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Google Drive</h4>
                        <p className="text-sm text-muted-foreground">Import Google Sheets and data files from Drive</p>
                      </div>
                    </div>
                    <Button
                      variant={integrationStatus.googledrive === "connected" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => handleConnect("googledrive")}
                      disabled={connectingService !== null}
                    >
                      {connectingService === "googledrive" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : integrationStatus.googledrive === "connected" ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                          </svg>
                          Disconnect
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 15v4a2 2 0 0 0 2 2h16v-4" />
                            <path d="M18 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M18 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          </svg>
                          Connect
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Xero Integration */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="mr-4 bg-indigo-100 p-2 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-indigo-700"
                        >
                          <path d="M6 12L12 6L18 12L12 18L6 12Z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Xero</h4>
                        <p className="text-sm text-muted-foreground">
                          Import financial data from Xero accounting software
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={integrationStatus.xero === "connected" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => handleConnect("xero")}
                      disabled={connectingService !== null}
                    >
                      {connectingService === "xero" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : integrationStatus.xero === "connected" ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                          </svg>
                          Disconnect
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 15v4a2 2 0 0 0 2 2h16v-4" />
                            <path d="M18 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M18 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          </svg>
                          Connect
                        </>
                      )}
                    </Button>
                  </div>

                  {/* MYOB Integration */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="mr-4 bg-purple-100 p-2 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-purple-700"
                        >
                          <path
                            d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 6V12M12 12L16 15M12 12L8 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">MYOB</h4>
                        <p className="text-sm text-muted-foreground">Import financial and business data from MYOB</p>
                      </div>
                    </div>
                    <Button
                      variant={integrationStatus.myob === "connected" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => handleConnect("myob")}
                      disabled={connectingService !== null}
                    >
                      {connectingService === "myob" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : integrationStatus.myob === "connected" ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                          </svg>
                          Disconnect
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 15v4a2 2 0 0 0 2 2h16v-4" />
                            <path d="M18 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M18 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          </svg>
                          Connect
                        </>
                      )}
                    </Button>
                  </div>

                  {/* JotForm Integration */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="mr-4 bg-green-100 p-2 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-700"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M7 7h10" />
                          <path d="M7 12h10" />
                          <path d="M7 17h5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">JotForm</h4>
                        <p className="text-sm text-muted-foreground">Import form submissions and survey data</p>
                      </div>
                    </div>
                    <Button
                      variant={integrationStatus.jotform === "connected" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => handleConnect("jotform")}
                      disabled={connectingService !== null}
                    >
                      {connectingService === "jotform" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : integrationStatus.jotform === "connected" ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                          </svg>
                          Disconnect
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 15v4a2 2 0 0 0 2 2h16v-4" />
                            <path d="M18 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M18 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          </svg>
                          Connect
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-2">
                    <Button variant="default" className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Add Custom Integration
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">API Keys</h3>
                      <p className="text-sm text-gray-500">Manage API keys for this {project.type.toLowerCase()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate New Key
                    </Button>
                  </div>

                  <div className="mt-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">No API keys</p>
                        <p className="text-sm text-gray-500">You haven't generated any API keys yet</p>
                      </div>
                      <div className="flex items-center">
                        <Info className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">API access must be enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="joint-venture">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Joint Venture Setup</CardTitle>
                <CardDescription>
                  Manage joint venture partners and ownership percentages for this {project.type.toLowerCase()}
                </CardDescription>
              </div>
              <Dialog open={isJointVentureDialogOpen} onOpenChange={setIsJointVentureDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Invite Organization to Joint Venture</DialogTitle>
                    <DialogDescription>
                      Invite an organization that's already using the platform to collaborate on this project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="partner-email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="partner-email"
                        type="email"
                        value={newPartner.email}
                        onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                        placeholder="admin@partner-org.com"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="partner-role" className="text-right">
                        Role
                      </Label>
                      <Select onValueChange={(value) => setNewPartner({ ...newPartner, role: value })}>
                        <SelectTrigger id="partner-role" className="col-span-3">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin (Full access)</SelectItem>
                          <SelectItem value="contributor">Contributor (Can add data)</SelectItem>
                          <SelectItem value="viewer">Viewer (Read-only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ownership-percentage" className="text-right">
                        Ownership %
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <Input
                          id="ownership-percentage"
                          type="number"
                          min="1"
                          max="99"
                          value={newPartner.ownership}
                          onChange={(e) => setNewPartner({ ...newPartner, ownership: Number.parseInt(e.target.value) })}
                          className="w-24"
                        />
                        <span className="ml-2 text-sm text-gray-500">% of project emissions</span>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                        <div className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500 mr-2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                          </svg>
                          <div className="text-sm text-blue-700">
                            <p className="font-medium">Inviting existing users</p>
                            <p className="text-blue-600 text-xs mt-1">
                              The invited organization must already have an account on the platform. They'll be able to
                              access this project with their existing license.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={() => setIsJointVentureDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        addJointVenturePartner({
                          ...newPartner,
                          name: newPartner.email.split("@")[1] || "Organization",
                        })
                        setNewPartner({ name: "", email: "", ownership: 10, role: "contributor" })
                        setIsJointVentureDialogOpen(false)
                      }}
                      disabled={!newPartner.email}
                    >
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Project Ownership Distribution</h3>
                    <Badge variant="outline" className="text-sm">
                      {jointVenturePartners.reduce((sum, partner) => sum + partner.ownership, 0)}% Allocated
                    </Badge>
                  </div>

                  <div className="h-8 w-full rounded-full overflow-hidden bg-gray-100">
                    {jointVenturePartners.map((partner, index) => (
                      <div
                        key={partner.id}
                        className={`h-full float-left ${
                          index % 3 === 0 ? "bg-blue-500" : index % 3 === 1 ? "bg-green-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${partner.ownership}%` }}
                        title={`${partner.name}: ${partner.ownership}%`}
                      />
                    ))}
                    <div
                      className="h-full float-left bg-gray-200"
                      style={{
                        width: `${100 - jointVenturePartners.reduce((sum, partner) => sum + partner.ownership, 0)}%`,
                      }}
                      title="Unallocated"
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Ownership percentages determine how emissions are attributed to each partner organization.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Partner Organizations</h3>

                  {jointVenturePartners.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-lg">
                      <p className="text-gray-500">No partner organizations added yet</p>
                      <Button variant="outline" className="mt-2" onClick={() => setIsJointVentureDialogOpen(true)}>
                        Add your first partner
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {jointVenturePartners.map((partner) => (
                        <div
                          key={partner.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className="mr-3 bg-gray-100 p-2 rounded-full">
                                <Building className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{partner.name}</p>
                                <p className="text-xs text-gray-500">{partner.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <Label htmlFor={`ownership-${partner.id}`} className="mr-2 text-sm">
                                Ownership:
                              </Label>
                              <div className="flex items-center">
                                <Input
                                  id={`ownership-${partner.id}`}
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={partner.ownership}
                                  onChange={(e) => updatePartnerOwnership(partner.id, Number.parseInt(e.target.value))}
                                  className="w-16 h-8 text-sm"
                                />
                                <span className="ml-1">%</span>
                              </div>
                            </div>

                            <Badge
                              className={
                                partner.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }
                            >
                              {partner.status === "active" ? "Active" : "Pending"}
                            </Badge>

                            <Button variant="ghost" size="icon" onClick={() => removeJointVenturePartner(partner.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Joint Venture Settings</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="shared-data">Shared Data Access</Label>
                          <p className="text-sm text-gray-500">
                            Allow partners to view all emission data for this project
                          </p>
                        </div>
                        <Switch id="shared-data" defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emission-attribution">Automatic Emission Attribution</Label>
                          <p className="text-sm text-gray-500">
                            Automatically attribute emissions based on ownership percentages
                          </p>
                        </div>
                        <Switch id="emission-attribution" defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="partner-invites">Allow Partner Invitations</Label>
                          <p className="text-sm text-gray-500">
                            Let partners invite additional organizations to the project
                          </p>
                        </div>
                        <Switch id="partner-invites" defaultChecked={false} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>These actions are destructive and cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <h3 className="text-sm font-medium text-red-800">Delete {project.type}</h3>
                  <p className="text-sm text-red-600 mt-1 mb-4">
                    Permanently delete this {project.type.toLowerCase()} and all associated data. This action cannot be
                    undone.
                  </p>
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete {project.type}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently delete the {project.type.toLowerCase()} "{project.name}" and all
                          associated data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleDeleteProject}
                        >
                          Delete {project.type}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                  <h3 className="text-sm font-medium text-orange-800">Archive {project.type}</h3>
                  <p className="text-sm text-orange-600 mt-1 mb-4">
                    Archive this {project.type.toLowerCase()} to make it read-only. You can unarchive it later.
                  </p>
                  <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Archive {project.type}
                  </Button>
                </div>

                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-800">Transfer Ownership</h3>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    Transfer ownership of this {project.type.toLowerCase()} to another user.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select a new owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {project.members.map((member: any) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Transfer</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

