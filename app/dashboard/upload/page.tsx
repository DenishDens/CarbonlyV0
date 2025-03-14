import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import EmissionDataManager from "@/components/dashboard/emission-data-manager"

export const metadata: Metadata = {
  title: "Emission Data | Carbonly.ai",
  description: "Manage, view, and upload your carbon emission data",
}

export default function EmissionDataPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Emission Data</h1>
        <EmissionDataManager />
      </div>
    </DashboardLayout>
  )
}

