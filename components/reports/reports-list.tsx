"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart2, Calendar, ChevronRight, FileText, PieChart } from "lucide-react"

// This is a placeholder component since we don't have actual reports data yet
export function ReportsList() {
  const reportTypes = [
    {
      id: "emissions-summary",
      title: "Emissions Summary",
      description: "Overview of your organization's carbon emissions across all scopes.",
      icon: BarChart2,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "project-comparison",
      title: "Project Comparison",
      description: "Compare emissions across different projects and departments.",
      icon: PieChart,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "monthly-trends",
      title: "Monthly Trends",
      description: "Track your emission trends over time with monthly breakdowns.",
      icon: Calendar,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "compliance-report",
      title: "Compliance Report",
      description: "Generate reports for regulatory compliance and disclosure.",
      icon: FileText,
      color: "bg-amber-100 text-amber-600",
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available Report Types</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-full ${report.color}`}>
                  <report.icon className="h-5 w-5" />
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/reports/new?type=${report.id}`}>
                    Generate
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardTitle className="text-lg mt-2">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <h3 className="text-lg font-medium mt-8">Recent Reports</h3>
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No reports generated yet</h3>
          <p className="text-muted-foreground mb-4">
            Generate your first report to track and analyze your carbon emissions.
          </p>
          <Button asChild>
            <Link href="/dashboard/reports/new">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

