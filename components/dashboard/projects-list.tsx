import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Users } from "lucide-react"

export default function ProjectsList() {
  // Mock data - in a real app, this would come from your API
  const projects = [
    {
      id: 1,
      name: "Headquarters",
      type: "Business Unit",
      members: 12,
      emissions: 450.75,
      status: "active",
    },
    {
      id: 2,
      name: "Manufacturing Plant A",
      type: "Business Unit",
      members: 8,
      emissions: 780.2,
      status: "active",
    },
    {
      id: 3,
      name: "Supply Chain Analysis",
      type: "Project",
      members: 5,
      emissions: 320.5,
      status: "active",
    },
    {
      id: 4,
      name: "Retail Stores",
      type: "Business Unit",
      members: 3,
      emissions: 180.3,
      status: "draft",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects & Business Units</CardTitle>
        <CardDescription>Manage your organization's projects and business units</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div className="mr-3 mt-0.5">
                <Building className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                  <Badge
                    className={`ml-2 ${
                      project.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {project.status === "active" ? "Active" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{project.type}</p>
                <div className="flex items-center mt-1">
                  <Users className="h-3.5 w-3.5 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-500">{project.members} members</p>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium text-gray-900">{project.emissions.toFixed(2)} tCO₂e</p>
                <p className="text-xs text-gray-500">Total Emissions</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

