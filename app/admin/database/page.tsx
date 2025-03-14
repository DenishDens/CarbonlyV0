import { AdminLayout } from "@/components/admin/admin-layout"
import { EmissionFactorsDatabase } from "@/components/admin/emission-factors-database"

export default function DatabasePage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Emission Factors Database</h2>
      </div>
      <div className="mt-6">
        <EmissionFactorsDatabase />
      </div>
    </AdminLayout>
  )
}

