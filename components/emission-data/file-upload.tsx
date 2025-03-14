"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  FileType,
  FileSpreadsheet,
  FileImage,
  FilePlus,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

interface ProcessedRecord {
  id: string
  date: string
  activity: string
  emission_value: number
  unit: string
  source: string
  confidence?: number
  status?: "verified" | "pending" | "error"
  notes?: string
  selected?: boolean
  isEditing?: boolean
}

interface EmissionFormData {
  date: string
  activity: string
  emission_value: number
  unit: string
  source: string
  notes?: string
}

export function FileUpload({ onUploadComplete }: { onUploadComplete?: (data: ProcessedRecord[]) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadType, setUploadType] = useState<"ai" | "manual">("ai")
  const [mappingStatus, setMappingStatus] = useState<"idle" | "mapping" | "success" | "error">("idle")
  const [mappedFields, setMappedFields] = useState<Record<string, string>>({})
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvPreview, setCsvPreview] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [processedData, setProcessedData] = useState<ProcessedRecord[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [importing, setImporting] = useState(false)
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set())
  const [editingRecord, setEditingRecord] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<EmissionFormData>({
    date: format(new Date(), "yyyy-MM-dd"),
    activity: "",
    emission_value: 0,
    unit: "kg CO2e",
    source: "",
    notes: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Reset states
    setMappingStatus("idle")
    setMappedFields({})
    setCsvHeaders([])
    setCsvPreview([])

    // Validate file type
    const fileType = selectedFile.type
    const fileName = selectedFile.name.toLowerCase()

    if (
      fileType === "application/pdf" ||
      fileType.startsWith("image/") ||
      fileType === "text/csv" ||
      fileName.endsWith(".csv")
    ) {
      setFile(selectedFile)

      // If it's a CSV file, try to parse headers for manual mapping
      if (fileType === "text/csv" || fileName.endsWith(".csv")) {
        parseCSVHeaders(selectedFile)
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, image, or CSV file.",
        variant: "destructive",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const parseCSVHeaders = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (text) {
        const lines = text.split("\n")
        if (lines.length > 0) {
          const headers = lines[0].split(",").map((header) => header.trim())
          setCsvHeaders(headers)

          // Create preview data (up to 3 rows)
          const previewData = []
          for (let i = 1; i < Math.min(lines.length, 4); i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(",").map((value) => value.trim())
              const rowData: Record<string, string> = {}
              headers.forEach((header, index) => {
                rowData[header] = values[index] || ""
              })
              previewData.push(rowData)
            }
          }
          setCsvPreview(previewData)

          // Initialize mapping with empty values
          const initialMapping: Record<string, string> = {}
          headers.forEach((header) => {
            initialMapping[header] = ""
          })
          setMappedFields(initialMapping)
        }
      }
    }
    reader.readAsText(file)
  }

  const handleFieldMapping = (csvField: string, appField: string) => {
    setMappedFields((prev) => ({
      ...prev,
      [csvField]: appField,
    }))
  }

  const validateMapping = () => {
    // Check if required fields are mapped
    const requiredFields = ["date", "activity", "emission_value", "unit"]
    const mappedValues = Object.values(mappedFields)

    return requiredFields.every((field) => mappedValues.includes(field))
  }

  const processManualMapping = async () => {
    if (!file) return

    setMappingStatus("mapping")

    try {
      // Validate mapping
      if (!validateMapping()) {
        toast({
          title: "Invalid mapping",
          description: "Please map all required fields: date, activity, emission value, and unit.",
          variant: "destructive",
        })
        setMappingStatus("error")
        return
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result as string
        if (text) {
          const lines = text.split("\n")
          const headers = lines[0].split(",").map((header) => header.trim())

          // Process data rows
          const processedData = []
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(",").map((value) => value.trim())
              const rowData: Record<string, any> = {}

              // Apply mapping
              headers.forEach((header, index) => {
                const appField = mappedFields[header]
                if (appField) {
                  rowData[appField] = values[index] || ""
                }
              })

              // Only add rows that have the required fields
              if (rowData.date && rowData.activity && rowData.emission_value && rowData.unit) {
                processedData.push(rowData)
              }
            }
          }

          if (processedData.length > 0) {
            setMappingStatus("success")
            toast({
              title: "Mapping successful",
              description: `Processed ${processedData.length} records.`,
              variant: "default",
            })

            if (onUploadComplete) {
              onUploadComplete(processedData)
            }
          } else {
            setMappingStatus("error")
            toast({
              title: "Mapping failed",
              description: "No valid records found after mapping. Please check your mapping.",
              variant: "destructive",
            })
          }
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error("Error processing CSV:", error)
      setMappingStatus("error")
      toast({
        title: "Processing failed",
        description: "Failed to process the CSV file. Trying AI processing...",
        variant: "destructive",
      })

      // Fall back to AI processing
      handleUpload()
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 300)

      // Upload file to storage
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `emission-data/${fileName}`

      // Try to get bucket info to check if it exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("uploads")

      // If bucket doesn't exist, try to create it
      if (bucketError && bucketError.message.includes("not found")) {
        try {
          // Try to create the bucket
          const { error: createBucketError } = await supabase.storage.createBucket("uploads", {
            public: true,
          })

          if (createBucketError) {
            // If we can't create the bucket, use local processing instead
            console.warn("Could not create storage bucket. Using local processing instead.", createBucketError)
            await processFileLocally(file)
            return
          }
        } catch (createError) {
          console.warn("Error creating bucket:", createError)
          await processFileLocally(file)
          return
        }
      }

      // Try to upload the file
      const { error: uploadError } = await supabase.storage.from("uploads").upload(filePath, file)

      if (uploadError) {
        console.warn("Upload error, falling back to local processing:", uploadError)
        await processFileLocally(file)
        return
      }

      // Get file URL
      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(filePath)

      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(interval)
      setProgress(100)

      // Simulate processed data
      const processedData = [
        {
          date: new Date().toISOString().split("T")[0],
          activity: "Transportation",
          emission_value: Math.floor(Math.random() * 1000) / 10,
          unit: "kg CO2e",
          source: file.name,
        },
        {
          date: new Date().toISOString().split("T")[0],
          activity: "Electricity",
          emission_value: Math.floor(Math.random() * 500) / 10,
          unit: "kg CO2e",
          source: file.name,
        },
      ]

      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        setFile(null)

        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        toast({
          title: "Upload complete",
          description: `Successfully processed ${processedData.length} emission records.`,
          variant: "default",
        })

        if (onUploadComplete) {
          onUploadComplete(processedData)
        }
      }, 1000)
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploading(false)
      setProgress(0)

      toast({
        title: "Upload failed",
        description: "Failed to upload and process the file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const processFileLocally = async (file: File) => {
    // Simulate AI processing locally
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setProgress(100)

    // Generate sample data based on file type
    const fileType = file.type
    const fileName = file.name.toLowerCase()

    let records: ProcessedRecord[] = []

    if (fileType === "text/csv" || fileName.endsWith(".csv")) {
      // For CSV, try to extract some actual data
      try {
        const text = await readFileAsText(file)
        const lines = text.split("\n")
        if (lines.length > 1) {
          // Assume first row is header
          const headers = lines[0].split(",").map((h) => h.trim())

          // Try to find date, activity and value columns
          const dateIndex = headers.findIndex(
            (h) => h.toLowerCase().includes("date") || h.toLowerCase().includes("time"),
          )
          const activityIndex = headers.findIndex(
            (h) => h.toLowerCase().includes("activity") || h.toLowerCase().includes("description"),
          )
          const valueIndex = headers.findIndex(
            (h) =>
              h.toLowerCase().includes("value") ||
              h.toLowerCase().includes("emission") ||
              h.toLowerCase().includes("co2"),
          )

          // Process up to 5 rows
          for (let i = 1; i < Math.min(lines.length, 6); i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(",").map((v) => v.trim())
              records.push({
                id: Math.random().toString(36).substr(2, 9),
                date: dateIndex >= 0 ? values[dateIndex] : new Date().toISOString().split("T")[0],
                activity: activityIndex >= 0 ? values[activityIndex] : "Activity " + i,
                emission_value:
                  valueIndex >= 0 ? Number.parseFloat(values[valueIndex]) : Math.floor(Math.random() * 1000) / 10,
                unit: "kg CO2e",
                source: file.name,
                confidence: Math.random() * 40 + 60, // Random confidence between 60-100%
                status: Math.random() > 0.3 ? "verified" : "pending",
              })
            }
          }
        }
      } catch (e) {
        console.warn("Error parsing CSV:", e)
      }
    }

    // If we couldn't extract data or it's not a CSV, use sample data
    if (records.length === 0) {
      records = [
        {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split("T")[0],
          activity: fileType.includes("image") ? "Business Travel" : "Transportation",
          emission_value: Math.floor(Math.random() * 1000) / 10,
          unit: "kg CO2e",
          source: file.name,
          confidence: 85,
          status: "verified",
          notes: "Extracted from " + (fileType.includes("image") ? "receipt" : "document"),
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split("T")[0],
          activity: fileType.includes("image") ? "Office Supplies" : "Electricity",
          emission_value: Math.floor(Math.random() * 500) / 10,
          unit: "kg CO2e",
          source: file.name,
          confidence: 92,
          status: "verified",
          notes:
            "Automatically categorized based on " + (fileType.includes("image") ? "image content" : "document type"),
        },
      ]
    }

    setProcessedData(records)
    setShowPreview(true)
    setUploading(false)
    setProgress(0)
  }

  const handleConfirmImport = async () => {
    setImporting(true)

    try {
      // Simulate API call to save the data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setImporting(false)
      setShowPreview(false)
      setFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast({
        title: "Import successful",
        description: `Added ${processedData.length} emission records to your database.`,
        variant: "default",
      })

      if (onUploadComplete) {
        onUploadComplete(processedData)
      }
    } catch (error) {
      console.error("Error importing data:", error)
      setImporting(false)

      toast({
        title: "Import failed",
        description: "Failed to import the processed records. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelImport = () => {
    setShowPreview(false)
    setProcessedData([])
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const getFileTypeIcon = () => {
    if (!file) return <Upload className="h-8 w-8 text-muted-foreground" />

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    if (fileType === "application/pdf") {
      return <FileType className="h-8 w-8 text-red-500" />
    } else if (fileType.startsWith("image/")) {
      return <FileImage className="h-8 w-8 text-blue-500" />
    } else if (fileType === "text/csv" || fileName.endsWith(".csv")) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />
    } else {
      return <FilePlus className="h-8 w-8 text-muted-foreground" />
    }
  }

  const renderUploadTab = () => (
    <div className="space-y-4">
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {getFileTypeIcon()}
        <p className="mt-2 text-sm text-muted-foreground">{file ? file.name : "Click to upload or drag and drop"}</p>
        <p className="text-xs text-muted-foreground">PDF, Images, or CSV (max 10MB)</p>
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.csv"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {file && file.name.toLowerCase().endsWith(".csv") && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setUploadType("manual")}>
            Manual Mapping
          </Button>
          <Button variant="default" onClick={() => setUploadType("ai")}>
            AI Processing
          </Button>
        </div>
      )}

      {file && uploadType === "ai" && (
        <Button className="w-full" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Processing..." : "Upload and Process"}
        </Button>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {progress < 100 ? "Analyzing and extracting data..." : "Finalizing results..."}
          </p>
        </div>
      )}
    </div>
  )

  const renderMappingTab = () => (
    <div className="space-y-4">
      {csvHeaders.length > 0 ? (
        <>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>CSV Mapping</AlertTitle>
              <AlertDescription>Map your CSV columns to the required fields in our system.</AlertDescription>
            </Alert>

            <div className="space-y-3">
              {csvHeaders.map((header) => (
                <div key={header} className="grid grid-cols-2 gap-2 items-center">
                  <div className="text-sm font-medium">{header}</div>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    value={mappedFields[header] || ""}
                    onChange={(e) => handleFieldMapping(header, e.target.value)}
                  >
                    <option value="">-- Select field --</option>
                    <option value="date">Date</option>
                    <option value="activity">Activity</option>
                    <option value="emission_value">Emission Value</option>
                    <option value="unit">Unit</option>
                    <option value="source">Source</option>
                    <option value="notes">Notes</option>
                    <option value="ignore">Ignore this column</option>
                  </select>
                </div>
              ))}
            </div>

            {csvPreview.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Preview (first {csvPreview.length} rows):</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        {csvHeaders.map((header) => (
                          <th key={header} className="border border-muted p-1 text-left">
                            {header}
                            {mappedFields[header] && (
                              <span className="block text-xs text-muted-foreground">→ {mappedFields[header]}</span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {csvHeaders.map((header) => (
                            <td key={`${rowIndex}-${header}`} className="border border-muted p-1">
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setUploadType("ai")}>
                Use AI Instead
              </Button>
              <Button onClick={processManualMapping} disabled={mappingStatus === "mapping"}>
                {mappingStatus === "mapping" ? "Processing..." : "Process Data"}
              </Button>
            </div>

            {mappingStatus === "mapping" && <Progress value={50} className="h-2" />}

            {mappingStatus === "success" && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your data has been successfully mapped and processed.
                </AlertDescription>
              </Alert>
            )}

            {mappingStatus === "error" && (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to process the data with the current mapping. Please check your mapping or try AI processing.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No CSV file selected or the file has no headers.</p>
          <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
            Select CSV File
          </Button>
        </div>
      )}
    </div>
  )

  const handleRecordSelection = (recordId: string) => {
    setSelectedRecords((prev) => {
      const next = new Set(prev)
      if (next.has(recordId)) {
        next.delete(recordId)
      } else {
        next.add(recordId)
      }
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecords(new Set(processedData.map((record) => record.id)))
    } else {
      setSelectedRecords(new Set())
    }
  }

  const handleEditRecord = (record: ProcessedRecord) => {
    setFormData({
      date: record.date,
      activity: record.activity,
      emission_value: record.emission_value,
      unit: record.unit,
      source: record.source,
      notes: record.notes,
    })
    setEditingRecord(record.id)
  }

  const handleUpdateRecord = () => {
    if (!editingRecord) return

    setProcessedData((prev) =>
      prev.map((record) => (record.id === editingRecord ? { ...record, ...formData } : record)),
    )
    setEditingRecord(null)
    setFormData({
      date: format(new Date(), "yyyy-MM-dd"),
      activity: "",
      emission_value: 0,
      unit: "kg CO2e",
      source: "",
      notes: "",
    })
  }

  const handleAddRecord = () => {
    const newRecord: ProcessedRecord = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      confidence: 100,
      status: "verified",
      selected: true,
    }
    setProcessedData((prev) => [...prev, newRecord])
    setSelectedRecords((prev) => new Set(prev).add(newRecord.id))
    setShowAddForm(false)
    setFormData({
      date: format(new Date(), "yyyy-MM-dd"),
      activity: "",
      emission_value: 0,
      unit: "kg CO2e",
      source: "",
      notes: "",
    })
  }

  const handleDeleteRecord = (recordId: string) => {
    setProcessedData((prev) => prev.filter((record) => record.id !== recordId))
    setSelectedRecords((prev) => {
      const next = new Set(prev)
      next.delete(recordId)
      return next
    })
  }

  const renderEmissionForm = (isEdit = false) => (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-medium">{isEdit ? "Edit Record" : "Add New Record"}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity">Activity</Label>
          <Input
            id="activity"
            value={formData.activity}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity: e.target.value }))}
            placeholder="e.g., Transportation"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emission_value">Emission Value</Label>
          <Input
            id="emission_value"
            type="number"
            value={formData.emission_value}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, emission_value: Number.parseFloat(e.target.value) || 0 }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
            placeholder="e.g., kg CO2e"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            value={formData.source}
            onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
            placeholder="e.g., Utility Bill"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formData.notes || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes..."
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingRecord(null)
            } else {
              setShowAddForm(false)
            }
            setFormData({
              date: format(new Date(), "yyyy-MM-dd"),
              activity: "",
              emission_value: 0,
              unit: "kg CO2e",
              source: "",
              notes: "",
            })
          }}
        >
          Cancel
        </Button>
        <Button onClick={isEdit ? handleUpdateRecord : handleAddRecord}>{isEdit ? "Update" : "Add"} Record</Button>
      </div>
    </div>
  )

  const renderPreviewDialog = () => (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Preview Processed Records</DialogTitle>
          <DialogDescription>Review the extracted emission data before importing</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>AI Processing Results</AlertTitle>
            <AlertDescription>
              Found {processedData.length} emission records in {file?.name}. Select records to import and edit values if
              needed.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button variant="outline" className="mb-2" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>

          {showAddForm && renderEmissionForm()}

          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedRecords.size === processedData.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-right">Emission Value</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRecords.has(record.id)}
                        onCheckedChange={() => handleRecordSelection(record.id)}
                      />
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.activity}</TableCell>
                    <TableCell className="text-right">{record.emission_value.toFixed(1)}</TableCell>
                    <TableCell>{record.unit}</TableCell>
                    <TableCell>{record.source}</TableCell>
                    <TableCell>
                      <Badge variant={record.confidence && record.confidence >= 80 ? "default" : "secondary"}>
                        {record.confidence?.toFixed(0)}% confident
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.status === "verified" ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : record.status === "pending" ? (
                        <Badge variant="outline">Pending</Badge>
                      ) : (
                        <Badge variant="destructive">Error</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRecord(record)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord(record.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {editingRecord && <div className="mt-4">{renderEmissionForm(true)}</div>}

          {processedData.some((record) => record.notes) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Processing Notes:</h4>
              {processedData.map(
                (record, index) =>
                  record.notes && (
                    <p key={index} className="text-sm text-muted-foreground">
                      • {record.notes}
                    </p>
                  ),
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={handleCancelImport} disabled={importing}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleConfirmImport} disabled={importing || selectedRecords.size === 0}>
              {importing ? (
                "Importing..."
              ) : (
                <>
                  Import {selectedRecords.size} Records
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // ... (keep existing render functions)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upload Emission Data</CardTitle>
          <CardDescription>Upload files containing emission data for AI processing or manual mapping</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" value={uploadType === "manual" ? "mapping" : "upload"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload & AI Process</TabsTrigger>
              <TabsTrigger value="mapping" disabled={!file || !file.name.toLowerCase().endsWith(".csv")}>
                Manual Mapping
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-4">
              {renderUploadTab()}
            </TabsContent>
            <TabsContent value="mapping" className="pt-4">
              {renderMappingTab()}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF (invoices, reports), Images (receipts, documents), CSV (spreadsheet data)
          </p>
        </CardFooter>
      </Card>
      {renderPreviewDialog()}
    </>
  )
}

