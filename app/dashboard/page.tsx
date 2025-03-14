import { EmissionsOverview } from "@/components/emissions-overview"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Welcome to your carbon emissions dashboard</p>
      <EmissionsOverview />
    </div>
  )
}

