import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileSpreadsheet, FileIcon as FilePdf, FileImage, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function RecentUploads() {
  // Mock data - in a real app, this would come from your API
  const uploads = [
    {
      id: 1,
      name: "Q1-2023-Energy-Report.pdf",
      type: "pdf",
      status: "processed",
      date: "2023-04-15T10:30:00Z",
      emissions: 125.45,
    },
    {
      id: 2,
      name: "Fleet-Fuel-Consumption.xlsx",
      type: "spreadsheet",
      status: "processed",
      date: "2023-04-10T14:20:00Z",
      emissions: 87.32,
    },
    {
      id: 3,
      name: "Supplier-Emissions-Data.csv",
      type: "spreadsheet",
      status: "processing",
      date: "2023-04-05T09:15:00Z",
      emissions: null,
    },
    {
      id: 4,
      name: "Facility-Energy-Bills.jpg",
      type: "image",
      status: "failed",
      date: "2023-04-01T16:45:00Z",
      emissions: null,
    },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-5 w-5 text-red-500" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case "image":
        return <FileImage className="h-5 w-5 text-blue-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Processed</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>Recently uploaded files and their processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploads.map((upload) => (
            <div key={upload.id} className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div className="mr-3 mt-0.5">{getFileIcon(upload.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{upload.name}</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-500">{formatDate(upload.date)}</p>
                  <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                  {getStatusBadge(upload.status)}
                </div>
              </div>
              {upload.emissions !== null && (
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium text-gray-900">{upload.emissions.toFixed(2)} tCO₂e</p>
                  <p className="text-xs text-gray-500">Emissions</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

