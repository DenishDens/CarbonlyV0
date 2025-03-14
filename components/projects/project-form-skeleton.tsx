"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ProjectFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
      
      <Skeleton className="h-10 w-[120px]" />
    </div>
  )
} 