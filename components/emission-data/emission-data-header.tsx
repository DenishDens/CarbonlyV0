import { Button } from "@/components/ui/button"
import { PlusCircle, Download, Upload, BarChart3 } from "lucide-react"
import Link from "next/link"

interface EmissionDataHeaderProps {
  totalRecords?: number
}

export function EmissionDataHeader({ totalRecords = 0 }: EmissionDataHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Emission Data</h1>
        <p className="text-muted-foreground">
          {totalRecords > 0
            ? `Manage and analyze your ${totalRecords.toLocaleString()} emission records`
            : "Start tracking your carbon emissions by uploading or entering data"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/emission-data/import">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/emission-data/export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/emission-data/visualize">
            <BarChart3 className="h-4 w-4 mr-2" />
            Visualize
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/dashboard/emission-data/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Record
          </Link>
        </Button>
      </div>
    </div>
  )
}

