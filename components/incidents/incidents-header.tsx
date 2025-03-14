"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IncidentsHeaderProps {
  organizationId: string
}

export function IncidentsHeader({ organizationId }: IncidentsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight">Incidents</h2>
      <Button asChild>
        <Link href={`/dashboard/incidents/new?organizationId=${organizationId}`}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Report Incident
        </Link>
      </Button>
    </div>
  )
}
