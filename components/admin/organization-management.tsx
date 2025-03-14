"use client"

import { useState } from "react"
import { ArrowUpDown, Building2, ChevronDown, Filter, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const organizations = [
  {
    id: "1",
    name: "Acme Corp",
    industry: "Manufacturing",
    size: "Enterprise",
    status: "active",
    projects: 12,
    users: 45,
    createdAt: "Jan 15, 2023",
  },
  {
    id: "2",
    name: "GreenTech",
    industry: "Technology",
    size: "Medium",
    status: "active",
    projects: 8,
    users: 23,
    createdAt: "Feb 3, 2023",
  },
  {
    id: "3",
    name: "EcoFriendly",
    industry: "Retail",
    size: "Small",
    status: "active",
    projects: 5,
    users: 12,
    createdAt: "Mar 10, 2023",
  },
  {
    id: "4",
    name: "Sustainable Inc",
    industry: "Energy",
    size: "Large",
    status: "active",
    projects: 15,
    users: 38,
    createdAt: "Nov 22, 2022",
  },
  {
    id: "5",
    name: "Green Future",
    industry: "Agriculture",
    size: "Medium",
    status: "pending",
    projects: 3,
    users: 9,
    createdAt: "Apr 5, 2023",
  },
  {
    id: "6",
    name: "Carbon Neutral",
    industry: "Transportation",
    size: "Large",
    status: "active",
    projects: 10,
    users: 27,
    createdAt: "Dec 12, 2022",
  },
  {
    id: "7",
    name: "Zero Waste",
    industry: "Waste Management",
    size: "Small",
    status: "inactive",
    projects: 2,
    users: 5,
    createdAt: "May 18, 2023",
  },
  {
    id: "8",
    name: "Climate Action",
    industry: "Non-profit",
    size: "Small",
    status: "active",
    projects: 6,
    users: 14,
    createdAt: "Feb 28, 2023",
  },
]

export function OrganizationManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddOrgOpen, setIsAddOrgOpen] = useState(false)

  const filteredOrgs = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.industry.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Manage organizations, their projects, and users.</CardDescription>
          </div>
          <Dialog open={isAddOrgOpen} onOpenChange={setIsAddOrgOpen}>
            <DialogTrigger asChild>
              <Button>
                <Building2 className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Organization</DialogTitle>
                <DialogDescription>Create a new organization and set up its initial configuration.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="org-name" className="text-right">
                    Name
                  </Label>
                  <Input id="org-name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="industry" className="text-right">
                    Industry
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="waste">Waste Management</SelectItem>
                      <SelectItem value="nonprofit">Non-profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="size" className="text-right">
                    Size
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-500 employees)</SelectItem>
                      <SelectItem value="large">Large (501-5000 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (5000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="admin-email" className="text-right">
                    Admin Email
                  </Label>
                  <Input id="admin-email" type="email" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOrgOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddOrgOpen(false)}>Create Organization</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Inactive</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Size</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked>Small</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Medium</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Large</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Enterprise</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <span>Organization</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <span>Industry</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.industry}</TableCell>
                  <TableCell>{org.size}</TableCell>
                  <TableCell>
                    <Badge
                      variant={org.status === "active" ? "default" : org.status === "pending" ? "outline" : "secondary"}
                    >
                      {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{org.projects}</TableCell>
                  <TableCell>{org.users}</TableCell>
                  <TableCell>{org.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit organization</DropdownMenuItem>
                        <DropdownMenuItem>Manage users</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Deactivate organization</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

