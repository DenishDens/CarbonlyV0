"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { EmissionRecord } from "./emission-data-table"

interface EmissionDataDetailsProps {
  record: EmissionRecord
  onClose: () => void
}

export function EmissionDataDetails({ record, onClose }: EmissionDataDetailsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleGenerateReport = () => {
    setLoading(true)

    // Simulate report generation
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Report generated",
        description: "A detailed report has been generated for this record",
      })
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{record.activity}</CardTitle>
        <CardDescription>Recorded on {record.date}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Emission Value</p>
            <p className="text-lg">
              {record.emission_value} {record.unit}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Status</p>
            <Badge variant={record.verified ? "default" : "outline"} className="mt-1">
              {record.verified ? (
                <div className="flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  Verified
                </div>
              ) : (
                "Pending Verification"
              )}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Source</p>
          <p>{record.source}</p>
        </div>

        {record.notes && (
          <div>
            <p className="text-sm font-medium">Notes</p>
            <p>{record.notes}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium">Carbon Impact</p>
          <p>This emission is equivalent to:</p>
          <ul className="list-disc list-inside text-sm pl-4 mt-2 space-y-1">
            <li>{(record.emission_value * 4.3).toFixed(1)} miles driven by an average car</li>
            <li>{(record.emission_value * 0.12).toFixed(1)} gallons of gasoline consumed</li>
            <li>{(record.emission_value * 0.11).toFixed(1)} trees needed to offset this carbon for one year</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Sharing options",
                description: "Sharing options will be available soon",
              })
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Download started",
                description: "Your data is being prepared for download",
              })
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

