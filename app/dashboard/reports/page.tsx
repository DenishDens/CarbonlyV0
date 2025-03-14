import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"
import { ReportsList } from "@/components/reports/reports-list"
import { ReportsHeader } from "@/components/reports/reports-header"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function ReportsPage() {
  return (
    <>
      <DashboardHeader heading="Reports" text="Generate and view carbon emission reports." />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Suspense fallback={<ReportsHeaderSkeleton />}>
          <ReportsHeader />
        </Suspense>
        <Suspense fallback={<ReportsListSkeleton />}>
          <ReportsList />
        </Suspense>
      </div>
    </>
  )
}

function ReportsHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-40" />
    </div>
  )
}

function ReportsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
    </div>
  )
}

