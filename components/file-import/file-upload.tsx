"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileProcessor, type ProcessingOptions, type ProcessingResult } from "@/lib/file-processing/file-processor"
import { FilePreview } from "./file-preview"
import { SheetSelector } from "./sheet-selector"
import { ColumnMapper } from "./column-mapper"
import { ImportSummary } from "./import-summary"
import { AlertCircle, FileSpreadsheet, FileText, Upload } from "lucide-react"

interface FileUploadProps {
  organizationId: string
  projectId?: string
  onComplete?: (result: ProcessingResult) => void
}

export function FileUpload({ organizationId, projectId, onComplete }: FileUploadProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null)
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null)
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fileProcessor = new FileProcessor()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (!e.target.files || e.target.files.length === 0) {
      setFile(null)
      return
    }

    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    // Reset state
    setProcessingResult(null)
    setSelectedSheet(null)
    setColumnMappings({})

    // Process file in preview mode
    await processFile(selectedFile, "preview")
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setError(null)

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
      return
    }

    const droppedFile = e.dataTransfer.files[0]
    setFile(droppedFile)

    // Reset state
    setProcessingResult(null)
    setSelectedSheet(null)
    setColumnMappings({})

    // Process file in preview mode
    await processFile(droppedFile, "preview")
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const processFile = async (fileToProcess: File, mode: "preview" | "standard" | "bulk") => {
    if (!fileToProcess) return

    setIsProcessing(true)
    setError(null)

    try {
      const options: ProcessingOptions = {
        organizationId,
        projectId,
        mode,
        selectedSheet: selectedSheet || undefined,
        columnMappings: Object.keys(columnMappings).length > 0 ? columnMappings : undefined,
        aiProcessingThreshold: mode === "preview" ? 0 : 0.5, // Only use AI in standard/bulk mode
      }

      const result = await fileProcessor.processFile(fileToProcess, options)
      setProcessingResult(result)

      if (result.success) {
        if (mode === "preview") {
          // If multiple sheets detected, show sheet selector
          if (result.sheets && result.sheets.length > 1 && !selectedSheet) {
            setActiveTab("sheets")
          } else {
            // Otherwise, show column mapping
            setActiveTab("mapping")
          }
        } else {
          // For standard/bulk processing, show results
          setActiveTab("results")
          if (onComplete) {
            onComplete(result)
          }
        }
      } else if (result.sheets && result.sheets.length > 1) {
        // Multiple sheets detected
        setActiveTab("sheets")
      } else if (result.errors && result.errors.length > 0) {
        setError(result.errors.join(". "))
      }
    } catch (err) {
      setError(`Error processing file: ${(err as Error).message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSheetSelect = (sheet: string) => {
    setSelectedSheet(sheet)
    processFile(file!, "preview")
  }

  const handleColumnMappingChange = (mappings: Record<string, string>) => {
    setColumnMappings(mappings)
  }

  const handleProcessFile = () => {
    if (file) {
      processFile(file, "standard")
    }
  }

  const handleBulkProcessFile = () => {
    if (file) {
      processFile(file, "bulk")
    }
  }

  const resetUpload = () => {
    setFile(null)
    setProcessingResult(null)
    setSelectedSheet(null)
    setColumnMappings({})
    setActiveTab("upload")
    setError(null)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
        <CardDescription>Upload your data files to import emission records</CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="sheets" disabled={!processingResult?.sheets || processingResult.sheets.length <= 1}>
            Sheets
          </TabsTrigger>
          <TabsTrigger value="mapping" disabled={!processingResult?.columns}>
            Mapping
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!processingResult?.data}>
            Results
          </TabsTrigger>
        </TabsList>

        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="upload">
            <div
              className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
              <p className="text-sm text-muted-foreground mb-4">Supports CSV, Excel, and JSON files</p>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileChange}
              />
              <Button variant="outline" type="button">
                Browse Files
              </Button>
            </div>

            {file && (
              <div className="mt-4">
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  {file.name.endsWith(".csv") ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <FileSpreadsheet className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sheets">
            {processingResult?.sheets && processingResult.sheets.length > 0 && (
              <SheetSelector
                sheets={processingResult.sheets}
                selectedSheet={selectedSheet}
                onSelect={handleSheetSelect}
              />
            )}
          </TabsContent>

          <TabsContent value="mapping">
            {processingResult?.columns && processingResult.columns.length > 0 && (
              <ColumnMapper
                columns={processingResult.columns}
                mappings={columnMappings}
                onChange={handleColumnMappingChange}
              />
            )}

            {processingResult?.data && processingResult.data.matched.length > 0 && (
              <div className="mt-6">
                <Label className="text-base font-medium">Data Preview</Label>
                <FilePreview data={processingResult.data.matched.slice(0, 5)} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="results">{processingResult && <ImportSummary result={processingResult} />}</TabsContent>
        </CardContent>

        <CardFooter className="flex justify-between">
          {activeTab !== "upload" && (
            <Button
              variant="outline"
              onClick={() => {
                const prevTab =
                  activeTab === "results"
                    ? "mapping"
                    : activeTab === "mapping"
                      ? processingResult?.sheets && processingResult.sheets.length > 1
                        ? "sheets"
                        : "upload"
                      : "upload"
                setActiveTab(prevTab)
              }}
            >
              Back
            </Button>
          )}

          <div className="ml-auto flex gap-2">
            {activeTab !== "results" && (
              <Button variant="outline" onClick={resetUpload}>
                Cancel
              </Button>
            )}

            {activeTab === "mapping" && (
              <>
                <Button variant="outline" onClick={handleBulkProcessFile}>
                  Process All
                </Button>
                <Button onClick={handleProcessFile} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Process File"}
                </Button>
              </>
            )}

            {activeTab === "results" && <Button onClick={resetUpload}>Import Another File</Button>}
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  )
}

