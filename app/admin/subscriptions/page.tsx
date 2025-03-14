import { AdminLayout } from "@/components/admin/admin-layout"
import { SubscriptionManagement } from "@/components/admin/subscription-management"

export default function SubscriptionsPage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Subscription Management</h2>
      </div>
      <div className="mt-6">
        <SubscriptionManagement />
      </div>
    </AdminLayout>
  )
}

