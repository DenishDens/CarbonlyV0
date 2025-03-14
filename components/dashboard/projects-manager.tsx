"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Users,
  BarChart3,
  FileUp,
  Settings,
  Trash2,
  Share2,
  Edit,
} from "lucide-react"
import { logger } from "@/lib/logger"

interface Project {
  id: string | number
  name: string
  description: string
  members: number
  emissions: number
  status: string
  lastUpdated: string
  type: string
  code: string
  location?: string
}

interface BusinessUnitCardProps {
  businessUnit: Project
  onInvite: () => void
  handleEditProject: (project: Project) => void
}

interface ProjectCardProps {
  project: Project
  onInvite: () => void
  handleEditProject: (project: Project) => void
}

export default function ProjectsManager() {
  const [activeTab, setActiveTab] = useState("business-units")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const router = useRouter()

  useEffect(() => {
    logger.info("ProjectsManager", "Component mounted")
    return () => {
      logger.info("ProjectsManager", "Component unmounted")
    }
  }, [])

  // Mock data - in a real app, this would come from your API
  const businessUnits = [
    {
      id: 1,
      name: "Headquarters",
      description: "Main corporate office and administrative facilities",
      members: 12,
      emissions: 450.75,
      status: "active",
      lastUpdated: "2023-04-15T10:30:00Z",
      type: "Business Unit",
      code: "HQ-001",
    },
    {
      id: 2,
      name: "Manufacturing Plant A",
      description: "Primary manufacturing facility for product lines A and B",
      members: 8,
      emissions: 780.2,
      status: "active",
      lastUpdated: "2023-04-10T14:20:00Z",
      type: "Business Unit",
      code: "MFG-001",
    },
    {
      id: 3,
      name: "Retail Stores",
      description: "All retail locations across North America",
      members: 3,
      emissions: 180.3,
      status: "draft",
      lastUpdated: "2023-04-01T16:45:00Z",
      type: "Business Unit",
      code: "RET-001",
    },
  ]

  const projects = [
    {
      id: 4,
      name: "Supply Chain Analysis",
      description: "Analyzing Scope 3 emissions across our supply chain",
      members: 5,
      emissions: 320.5,
      status: "active",
      lastUpdated: "2023-04-05T09:15:00Z",
      type: "Project",
      code: "PRJ-001",
    },
    {
      id: 5,
      name: "Carbon Reduction Initiative",
      description: "Company-wide initiative to reduce carbon emissions by 30% by 2025",
      members: 7,
      emissions: 0,
      status: "active",
      lastUpdated: "2023-04-03T11:45:00Z",
      type: "Project",
      code: "PRJ-002",
    },
    {
      id: 6,
      name: "Renewable Energy Transition",
      description: "Project to transition facilities to renewable energy sources",
      members: 4,
      emissions: 0,
      status: "draft",
      lastUpdated: "2023-03-28T13:20:00Z",
      type: "Project",
      code: "PRJ-003",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleCreateNew = async () => {
    setIsCreateDialogOpen(false)
    logger.info("ProjectsManager", "Creating new project/business unit", {
      type: activeTab === "business-units" ? "Business Unit" : "Project"
    })
    // In a real app, this would create a new business unit or project
  }

  const handleInviteUser = async () => {
    setIsInviteDialogOpen(false)
    logger.info("ProjectsManager", "Inviting user to project", {
      projectId: selectedProject?.id,
      projectName: selectedProject?.name
    })
    // In a real app, this would send an invitation to the user
  }

  const handleEditProject = (project: Project) => {
    logger.info("ProjectsManager", "Editing project", {
      projectId: project.id,
      projectName: project.name
    })
    setEditingProject(project)
    setIsEditDialogOpen(true)
  }

  const handleSaveProject = async () => {
    logger.info("ProjectsManager", "Saving project changes", {
      projectId: editingProject?.id,
      projectName: editingProject?.name
    })
    setIsEditDialogOpen(false)
    // In a real app, this would save the updated project data
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Tabs defaultValue="business-units" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="business-units">Business Units</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 ml-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New {activeTab === "business-units" ? "Business Unit" : "Project"}</DialogTitle>
                    <DialogDescription>
                      {activeTab === "business-units"
                        ? "Add a new business unit to track emissions for a specific part of your organization"
                        : "Create a new project to track specific sustainability initiatives"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" placeholder="Enter name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right pt-2">
                        Description
                      </Label>
                      <Textarea id="description" placeholder="Enter description" className="col-span-3" rows={3} />
                    </div>
                    {activeTab === "business-units" && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                          Location
                        </Label>
                        <Input id="location" placeholder="Enter location" className="col-span-3" />
                      </div>
                    )}
                    {activeTab === "projects" && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="related-bu" className="text-right">
                          Related Business Unit
                        </Label>
                        <select
                          id="related-bu"
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select a business unit</option>
                          {businessUnits.map((bu) => (
                            <option key={bu.id} value={bu.id}>
                              {bu.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateNew}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="business-units">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessUnits.map((unit) => (
                  <BusinessUnitCard
                    key={unit.id}
                    businessUnit={unit}
                    onInvite={() => {
                      setSelectedProject(unit)
                      setIsInviteDialogOpen(true)
                    }}
                    handleEditProject={handleEditProject}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onInvite={() => {
                      setSelectedProject(project)
                      setIsInviteDialogOpen(true)
                    }}
                    handleEditProject={handleEditProject}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>Invite users to collaborate on {selectedProject?.name}</DialogDescription>
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
              <select
                id="role"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
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
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleInviteUser}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingProject?.type || "Project"}</DialogTitle>
            <DialogDescription>Update information for {editingProject?.name}</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input id="edit-name" defaultValue={editingProject.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-code" className="text-right">
                  Project Code
                </Label>
                <Input
                  id="edit-code"
                  defaultValue={editingProject.code || ""}
                  placeholder="Enter project code"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  defaultValue={editingProject.description}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <select
                  id="edit-status"
                  defaultValue={editingProject.status}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              {editingProject.type === "Business Unit" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-location" className="text-right">
                    Location
                  </Label>
                  <Input id="edit-location" defaultValue={editingProject.location || ""} className="col-span-3" />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveProject}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BusinessUnitCard({ businessUnit, onInvite, handleEditProject }: BusinessUnitCardProps) {
  const router = useRouter()
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-3 bg-green-100 p-2 rounded-md">
              <Building className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg">{businessUnit.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${businessUnit.id}`)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditProject(businessUnit)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Business Unit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/upload?businessUnit=${businessUnit.id}`)}>
                <FileUp className="h-4 w-4 mr-2" />
                Upload Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onInvite}>
                <Share2 className="h-4 w-4 mr-2" />
                Invite Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${businessUnit.id}/settings`)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="mt-2">{businessUnit.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Badge
                className={
                  businessUnit.status === "active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : businessUnit.status === "inactive"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {businessUnit.status === "active"
                  ? "Active"
                  : businessUnit.status === "inactive"
                    ? "Inactive"
                    : "Draft"}
              </Badge>
              <span className="text-xs text-gray-500 ml-2">
                Updated {new Date(businessUnit.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{businessUnit.emissions.toFixed(2)} tCO₂e</p>
              <p className="text-xs text-gray-500">Total Emissions</p>
            </div>
          </div>

          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{businessUnit.members} team members</span>
            <div className="ml-auto flex -space-x-2">
              {[...Array(Math.min(3, businessUnit.members))].map((_, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="text-xs">
                    {`U${i + 1}`}
                  </AvatarFallback>
                </Avatar>
              ))}
              {businessUnit.members > 3 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 border-2 border-white text-xs font-medium text-gray-600">
                  +{businessUnit.members - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectCard({ project, onInvite, handleEditProject }: ProjectCardProps) {
  const router = useRouter()
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-3 bg-blue-100 p-2 rounded-md">
              <FolderOpen className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditProject(project)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/upload?project=${project.id}`)}>
                <FileUp className="h-4 w-4 mr-2" />
                Upload Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onInvite}>
                <Share2 className="h-4 w-4 mr-2" />
                Invite Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${project.id}/settings`)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="mt-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Badge
                className={
                  project.status === "active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : project.status === "inactive"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {project.status === "active" ? "Active" : project.status === "inactive" ? "Inactive" : "Draft"}
              </Badge>
              <span className="text-xs text-gray-500 ml-2">
                Updated {new Date(project.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            {project.emissions > 0 && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{project.emissions.toFixed(2)} tCO₂e</p>
                <p className="text-xs text-gray-500">Total Emissions</p>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{project.members} team members</span>
            <div className="ml-auto flex -space-x-2">
              {[...Array(Math.min(3, project.members))].map((_, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="text-xs">
                    {`U${i + 1}`}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members > 3 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 border-2 border-white text-xs font-medium text-gray-600">
                  +{project.members - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

