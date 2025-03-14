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

export default function ProjectDashboard({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
          members: projectId === "1" ? 12 : projectId === "2" ? 8 : 3,
          emissions: {
            total: projectId === "1" ? 450.75 : projectId === "2" ? 780.2 : 180.3,
            change: projectId === "1" ? -12.5 : projectId === "2" ? 5.2 : -8.7,
            scope1: projectId === "1" ? 120.45 : projectId === "2" ? 350.3 : 80.2,
            scope1Change: projectId === "1" ? -8.2 : projectId === "2" ? 3.5 : -5.1,
            scope2: projectId === "1" ? 280.3 : projectId === "2" ? 380.9 : 90.1,
            scope2Change: projectId === "1" ? -15.7 : projectId === "2" ? 6.8 : -12.3,
            scope3: projectId === "1" ? 50.0 : projectId === "2" ? 49.0 : 10.0,
            scope3Change: projectId === "1" ? -10.3 : projectId === "2" ? 2.1 : -4.8,
          },
          recentUploads: [
            {
              id: 1,
              name: `${projectId === "1" ? "HQ" : projectId === "2" ? "Plant-A" : "Retail"}-Energy-Report.pdf`,
              type: "pdf",
              status: "processed",
              date: "2023-04-15T10:30:00Z",
              emissions: 25.45,
            },
            {
              id: 2,
              name: `${projectId === "1" ? "HQ" : projectId === "2" ? "Plant-A" : "Retail"}-Consumption.xlsx`,
              type: "spreadsheet",
              status: "processed",
              date: "2023-04-10T14:20:00Z",
              emissions: 17.32,
            },
          ],
          teamMembers: [
            {
              id: 1,
              name: "John Doe",
              role: "Admin",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "JD",
            },
            {
              id: 2,
              name: "Jane Smith",
              role: "Editor",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "JS",
            },
          ],
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
          members: projectId === "4" ? 5 : projectId === "5" ? 7 : 4,
          emissions: {
            total: projectId === "4" ? 320.5 : projectId === "5" ? 0 : 0,
            change: projectId === "4" ? -9.3 : 0,
            scope1: projectId === "4" ? 80.25 : 0,
            scope1Change: projectId === "4" ? -7.1 : 0,
            scope2: projectId === "4" ? 90.15 : 0,
            scope2Change: projectId === "4" ? -8.5 : 0,
            scope3: projectId === "4" ? 150.1 : 0,
            scope3Change: projectId === "4" ? -11.2 : 0,
          },
          recentUploads:
            projectId === "4"
              ? [
                  {
                    id: 1,
                    name: "Supplier-Emissions-Data.csv",
                    type: "spreadsheet",
                    status: "processed",
                    date: "2023-04-12T09:15:00Z",
                    emissions: 150.1,
                  },
                ]
              : [],
          teamMembers: [
            {
              id: 1,
              name: "John Doe",
              role: "Admin",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "JD",
            },
            {
              id: 3,
              name: "Robert Johnson",
              role: "Viewer",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "RJ",
            },
          ],
        })
      }

      setLoading(false)
    }, 500)
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center">
            <div className={`mr-3 p-2 rounded-md ${project.type === "Business Unit" ? "bg-green-100" : "bg-blue-100"}`}>
              {project.type === "Business Unit" ? (
                <Building
                  className={`h-6 w-6 ${project.type === "Business Unit" ? "text-green-600" : "text-blue-600"}`}
                />
              ) : (
                <BarChart3
                  className={`h-6 w-6 ${project.type === "Business Unit" ? "text-green-600" : "text-blue-600"}`}
                />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex items-center mt-1">
                <Badge
                  className={
                    project.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {project.status === "active" ? "Active" : "Draft"}
                </Badge>
                <span className="text-sm text-gray-500 ml-2">{project.type}</span>
                {project.type === "Project" && project.relatedBusinessUnit && (
                  <span className="text-sm text-gray-500 ml-2">• {project.relatedBusinessUnit}</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2 max-w-2xl">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center">
            <FileUp className="h-4 w-4 mr-2" />
            Upload Data
          </Button>
          <Button variant="outline" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {project.type === "Business Unit" && project.location && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="mr-2 text-gray-500">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">{project.location}</p>
              </div>
              <div className="ml-auto flex items-center">
                <div className="mr-6">
                  <p className="text-sm font-medium">Team Members</p>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-1" />
                    <p className="text-sm text-gray-600">{project.members}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Emissions</p>
                  <p className="text-sm font-semibold text-gray-900">{project.emissions.total.toFixed(2)} tCO₂e</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EmissionMetricCard
          title="Total Emissions"
          value={`${project.emissions.total.toFixed(2)} tCO₂e`}
          change={project.emissions.change}
          description="Last 30 days"
        />
        <EmissionMetricCard
          title="Scope 1 Emissions"
          value={`${project.emissions.scope1.toFixed(2)} tCO₂e`}
          change={project.emissions.scope1Change}
          description="Direct emissions"
        />
        <EmissionMetricCard
          title="Scope 2 Emissions"
          value={`${project.emissions.scope2.toFixed(2)} tCO₂e`}
          change={project.emissions.scope2Change}
          description="Indirect emissions"
        />
        <EmissionMetricCard
          title="Scope 3 Emissions"
          value={`${project.emissions.scope3.toFixed(2)} tCO₂e`}
          change={project.emissions.scope3Change}
          description="Value chain emissions"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Emissions by Category</CardTitle>
                <CardDescription>Breakdown of emissions by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Emissions category chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>Files and data sources used for emissions calculations</CardDescription>
            </CardHeader>
            <CardContent>
              {project.recentUploads.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FileUp className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No data sources yet</h3>
                  <p className="text-gray-500 mb-4">
                    Upload files to start tracking emissions for this {project.type.toLowerCase()}
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload Data
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.recentUploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                    >
                      <div className="mr-3 mt-0.5">
                        {upload.type === "pdf" ? (
                          <div className="h-10 w-10 bg-red-100 rounded-md flex items-center justify-center">
                            <span className="text-xs font-medium text-red-700">PDF</span>
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                            <span className="text-xs font-medium text-green-700">XLS</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{upload.name}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">{new Date(upload.date).toLocaleDateString()}</p>
                          <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{upload.status}</Badge>
                        </div>
                      </div>
                      {upload.emissions !== null && (
                        <div className="ml-4 text-right">
                          <p className="text-sm font-medium text-gray-900">{upload.emissions.toFixed(2)} tCO₂e</p>
                          <p className="text-xs text-gray-500">Emissions</p>
                        </div>
                      )}
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People with access to this {project.type.toLowerCase()}</CardDescription>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Users className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage Access
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generated reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No reports generated yet</h3>
                <p className="text-gray-500 mb-4">
                  Generate reports to analyze emissions data for this {project.type.toLowerCase()}
                </p>
                <Button className="bg-green-600 hover:bg-green-700">Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface EmissionMetricCardProps {
  title: string
  value: string
  change: number
  description: string
}

function EmissionMetricCard({ title, value, change, description }: EmissionMetricCardProps) {
  const isPositive = change >= 0

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change !== 0 && (
          <p className={`ml-2 flex items-center text-sm font-medium ${isPositive ? "text-red-600" : "text-green-600"}`}>
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1 flex-shrink-0" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1 flex-shrink-0" />
            )}
            {Math.abs(change)}%
          </p>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  )
}

