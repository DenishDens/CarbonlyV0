import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EmissionDataForm } from "@/components/emission-data/emission-data-form"

export const metadata = {
  title: "Add Emission Data | Carbonly.ai",
  description: "Add new emission data to your carbon inventory",
}

export default function NewEmissionDataPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader heading="Add Emission Data" text="Add new emission data to your carbon inventory" />

      <EmissionDataForm />
    </div>
  )
}

