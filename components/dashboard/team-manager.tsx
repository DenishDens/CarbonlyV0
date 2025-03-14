"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, MoreHorizontal, Mail, Shield, Building, UserX, Edit, User } from "lucide-react"

export default function TeamManager() {
  const [activeTab, setActiveTab] = useState("members")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  // Mock data - in a real app, this would come from your API
  const members = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      organization: "Internal",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
      status: "active",
      lastActive: "2023-04-15T10:30:00Z",
      projects: ["Headquarters", "Supply Chain Analysis"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      organization: "Internal",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
      status: "active",
      lastActive: "2023-04-14T15:45:00Z",
      projects: ["Manufacturing Plant A", "Carbon Reduction Initiative"],
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@partner.com",
      role: "Viewer",
      organization: "Partner Co.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RJ",
      status: "active",
      lastActive: "2023-04-10T09:15:00Z",
      projects: ["Supply Chain Analysis"],
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@consultant.com",
      role: "Viewer",
      organization: "Consultant LLC",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ED",
      status: "pending",
      lastActive: null,
      projects: [],
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      role: "Editor",
      organization: "Internal",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MW",
      status: "active",
      lastActive: "2023-04-12T11:20:00Z",
      projects: ["Retail Stores", "Renewable Energy Transition"],
    },
  ]

  const pendingInvitations = [
    {
      id: 101,
      email: "alex@newcompany.com",
      role: "Editor",
      invitedBy: "John Doe",
      invitedOn: "2023-04-13T14:30:00Z",
      expiresOn: "2023-04-20T14:30:00Z",
    },
    {
      id: 102,
      email: "sarah@partner.org",
      role: "Viewer",
      invitedBy: "Jane Smith",
      invitedOn: "2023-04-14T09:45:00Z",
      expiresOn: "2023-04-21T09:45:00Z",
    },
  ]

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
      case "Editor":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Editor</Badge>
      case "Viewer":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Viewer</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const handleInviteUser = () => {
    setIsInviteDialogOpen(false)
    // In a real app, this would send an invitation to the user
  }

  const handleEditUser = (member: any) => {
    setSelectedMember(member)
    setIsEditDialogOpen(true)
  }

  const handleSaveUserEdit = () => {
    setIsEditDialogOpen(false)
    // In a real app, this would save the user's updated information
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="members" onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="members">Team Members</TabsTrigger>
              <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
            </TabsList>

            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>Invite a new user to join your organization</DialogDescription>
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
                    <Label htmlFor="projects" className="text-right pt-2">
                      Projects
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <select
                        id="projects"
                        multiple
                        size={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="headquarters">Headquarters</option>
                        <option value="manufacturing">Manufacturing Plant A</option>
                        <option value="retail">Retail Stores</option>
                        <option value="supply-chain">Supply Chain Analysis</option>
                        <option value="carbon-reduction">Carbon Reduction Initiative</option>
                        <option value="renewable-energy">Renewable Energy Transition</option>
                      </select>
                      <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple projects</p>
                    </div>
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
          </div>

          <TabsContent value="members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team members and their access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
                    >
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          {getStatusBadge(member.status)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Mail className="h-3.5 w-3.5 mr-1" />
                          {member.email}
                        </div>
                        {member.projects.length > 0 && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Building className="h-3.5 w-3.5 mr-1" />
                            {member.projects.join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        {member.organization !== "Internal" && (
                          <Badge variant="outline" className="mr-2">
                            {member.organization}
                          </Badge>
                        )}
                        {getRoleBadge(member.role)}
                        <div className="text-xs text-gray-500 text-right min-w-[100px]">
                          {member.lastActive ? (
                            <>
                              <p>Last active</p>
                              <p>{formatDate(member.lastActive)}</p>
                            </>
                          ) : (
                            <p>Never logged in</p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditUser(member)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Building className="h-4 w-4 mr-2" />
                              Manage Projects
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <UserX className="h-4 w-4 mr-2" />
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Track and manage pending team invitations</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingInvitations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No pending invitations</h3>
                    <p className="text-gray-500">All invitations have been accepted or have expired</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingInvitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
                      >
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                          <Mail className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">{invitation.email}</p>
                            <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <User className="h-3.5 w-3.5 mr-1" />
                            Invited by {invitation.invitedBy}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Shield className="h-3.5 w-3.5 mr-1" />
                            Role: {invitation.role}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 text-right min-w-[180px]">
                          <p>Invited on {formatDate(invitation.invitedOn)}</p>
                          <p>Expires on {formatDate(invitation.expiresOn)}</p>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <Button size="sm" variant="outline">
                            Resend
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input id="edit-name" defaultValue={selectedMember.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input id="edit-email" type="email" defaultValue={selectedMember.email} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <select
                  id="edit-role"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedMember.role}
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-organization" className="text-right">
                  Organization
                </Label>
                <Input id="edit-organization" defaultValue={selectedMember.organization} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-projects" className="text-right pt-2">
                  Projects
                </Label>
                <div className="col-span-3 space-y-2">
                  <select
                    id="edit-projects"
                    multiple
                    size={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="headquarters" selected={selectedMember.projects.includes("Headquarters")}>
                      Headquarters
                    </option>
                    <option value="manufacturing" selected={selectedMember.projects.includes("Manufacturing Plant A")}>
                      Manufacturing Plant A
                    </option>
                    <option value="retail" selected={selectedMember.projects.includes("Retail Stores")}>
                      Retail Stores
                    </option>
                    <option value="supply-chain" selected={selectedMember.projects.includes("Supply Chain Analysis")}>
                      Supply Chain Analysis
                    </option>
                    <option
                      value="carbon-reduction"
                      selected={selectedMember.projects.includes("Carbon Reduction Initiative")}
                    >
                      Carbon Reduction Initiative
                    </option>
                    <option
                      value="renewable-energy"
                      selected={selectedMember.projects.includes("Renewable Energy Transition")}
                    >
                      Renewable Energy Transition
                    </option>
                  </select>
                  <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple projects</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveUserEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

