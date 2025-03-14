import EmissionDataManager from "@/components/emission-data-manager"

export default function EmissionDataPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Emission Data</h1>
      <p className="text-gray-600">View, upload, and manage your emission data</p>
      <EmissionDataManager />
    </div>
  )
}

