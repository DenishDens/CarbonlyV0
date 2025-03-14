import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ProjectSettings from "@/components/dashboard/project-settings"

export const metadata: Metadata = {
  title: "Project Settings | Carbonly.ai",
  description: "Configure settings for your carbon emission tracking project",
}

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <ProjectSettings projectId={params.id} />
      </div>
    </DashboardLayout>
  )
}

