"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReportsHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
      <Button asChild>
        <Link href="/dashboard/reports/new">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Link>
      </Button>
    </div>
  )
}

