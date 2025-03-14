import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      <Skeleton className="col-span-2 h-[300px] md:col-span-4" />
      <Skeleton className="h-[300px] md:col-span-2" />
      <Skeleton className="h-[300px] md:col-span-2" />
    </div>
  )
}

