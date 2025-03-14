import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"
import { SettingsForm } from "@/components/settings/settings-form"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function SettingsPage() {
  return (
    <>
      <DashboardHeader heading="Settings" text="Manage your account and organization settings." />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Suspense fallback={<SettingsFormSkeleton />}>
          <SettingsForm />
        </Suspense>
      </div>
    </>
  )
}

function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

