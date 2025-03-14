"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Check, AlertCircle } from "lucide-react"
import type { FieldMapping } from "@/types/emission-data"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FieldMappingDialogProps {
  fileId: string
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function FieldMappingDialog({ fileId, isOpen, onClose, onComplete }: FieldMappingDialogProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mappings, setMappings] = useState<FieldMapping[]>([])
  const [targetFields, setTargetFields] = useState<{ field: string; label: string }[]>([])
  const [fileInfo, setFileInfo] = useState<{
    headers: string[]
    rowCount: number
    sampleValues: Record<string, any[]>
  } | null>(null)

  useEffect(() => {
    if (isOpen && fileId) {
      loadFieldMappings()
    }
  }, [isOpen, fileId])

  const loadFieldMappings = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/field-mapping?fileId=${fileId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load field mappings")
      }

      setFileInfo({
        headers: data.headers,
        rowCount: data.rowCount,
        sampleValues: data.sampleValues,
      })
      setTargetFields(data.targetFields)
      setMappings(data.suggestedMappings)
    } catch (err) {
      console.error("Error loading field mappings:", err)
      setError("Failed to load field mappings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMappingChange = (sourceField: string, targetField: string | null) => {
    setMappings((prev) =>
      prev.map((mapping) =>
        mapping.source_field === sourceField
          ? {
              ...mapping,
              target_field: targetField,
              is_matched: !!targetField,
            }
          : mapping,
      ),
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/field-mapping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          mappings,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save field mappings")
      }

      onComplete()
    } catch (err) {
      console.error("Error saving field mappings:", err)
      setError("Failed to save field mappings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Map Fields for Import</DialogTitle>
          <DialogDescription>
            Match the fields from your file to the system fields to process your data efficiently.
            {fileInfo && (
              <span className="block mt-1">
                File contains {fileInfo.rowCount} rows with {fileInfo.headers.length} columns.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading file data...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Mapping Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {mappings.filter((m) => m.is_matched).length} of {mappings.length} fields mapped
                  </p>
                </div>
                <div>
                  <Badge variant={mappings.some((m) => !m.is_matched) ? "outline" : "default"}>
                    {mappings.some((m) => !m.is_matched) ? "Incomplete Mapping" : "Ready to Import"}
                  </Badge>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Source Field</TableHead>
                  <TableHead className="w-[250px]">Map To</TableHead>
                  <TableHead>Sample Values</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping) => (
                  <TableRow key={mapping.source_field}>
                    <TableCell className="font-medium">{mapping.source_field}</TableCell>
                    <TableCell>
                      <Select
                        value={mapping.target_field || ""}
                        onValueChange={(value) => handleMappingChange(mapping.source_field, value || null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_import">Do not import</SelectItem>
                          {targetFields.map((field) => (
                            <SelectItem key={field.field} value={field.field}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate">
                        {fileInfo?.sampleValues[mapping.source_field]?.slice(0, 3).join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {mapping.is_matched ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="mr-1 h-3 w-3" /> Mapped
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Unmapped
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="rounded-md bg-blue-50 p-4 text-blue-800 text-sm">
              <p className="font-medium">Processing Information</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Mapped fields will be processed directly without AI</li>
                <li>Unmapped fields will be ignored during import</li>
                <li>Material codes and names will be matched against our database</li>
                <li>Only unmatched materials will be sent to AI for processing</li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Start Processing"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

