import { Suspense } from "react"
import { IncidentsHeader } from "@/components/incidents/incidents-header"
import { IncidentsList } from "@/components/incidents/incidents-list"
import { IncidentsSearch } from "@/components/incidents/incidents-search"

export default function IncidentsPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <IncidentsHeader />
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading search...</div>}>
        <IncidentsSearch />
      </Suspense>
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading incidents...</div>}>
        <IncidentsList />
      </Suspense>
    </div>
  )
}

