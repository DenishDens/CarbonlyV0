"use client"

import EmissionsOverview from "@/components/dashboard/emissions-overview"
import RecentUploads from "@/components/dashboard/recent-uploads"
import ProjectsList from "@/components/dashboard/projects-list"
import TeamMembers from "@/components/dashboard/team-members"

export default function DashboardContent() {
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <EmissionsOverview />
          <RecentUploads />
        </div>
        <div className="space-y-6">
          <ProjectsList />
          <TeamMembers />
        </div>
      </div>
    </div>
  )
}

