import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectReportsProps {
  projectId: string
}

export function ProjectReports({ projectId }: ProjectReportsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Reports</h2>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReportCard
          title="Monthly Emissions Summary"
          description="Summary of emissions for the current month"
          date="Generated on May 1, 2023"
          icon={BarChart2}
        />

        <ReportCard
          title="Quarterly Compliance Report"
          description="Regulatory compliance report for Q1 2023"
          date="Generated on April 15, 2023"
          icon={FileText}
        />

        <ReportCard
          title="Annual Emissions Report"
          description="Complete emissions data for 2022"
          date="Generated on January 10, 2023"
          icon={BarChart2}
        />

        <ReportCard
          title="Carbon Intensity Analysis"
          description="Analysis of carbon intensity metrics"
          date="Generated on March 5, 2023"
          icon={FileText}
        />
      </div>
    </div>
  )
}

interface ReportCardProps {
  title: string
  description: string
  date: string
  icon: React.ElementType
}

function ReportCard({ title, description, date, icon: Icon }: ReportCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{date}</span>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-3 w-3" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

