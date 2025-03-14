import { AdminLayout } from "@/components/admin/admin-layout"
import { OrganizationManagement } from "@/components/admin/organization-management"

export default function OrganizationsPage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Organization Management</h2>
      </div>
      <div className="mt-6">
        <OrganizationManagement />
      </div>
    </AdminLayout>
  )
}

