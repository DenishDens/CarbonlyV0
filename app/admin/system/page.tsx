import { AdminLayout } from "@/components/admin/admin-layout"
import { SystemSettings } from "@/components/admin/system-settings"

export default function SystemPage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
      </div>
      <div className="mt-6">
        <SystemSettings />
      </div>
    </AdminLayout>
  )
}

