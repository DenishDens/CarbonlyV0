"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Upload, FileText, FileSpreadsheet, FileIcon as FilePdf, FileImage, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function FileUploader() {
  const [uploadMethod, setUploadMethod] = useState<"file" | "manual">("file")
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleUpload = () => {
    if (files.length === 0) {
      setUploadError("Please select at least one file to upload")
      return
    }

    setUploading(true)
    setUploadError(null)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FilePdf className="h-8 w-8 text-red-500" />
      case "xlsx":
      case "xls":
      case "csv":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileImage className="h-8 w-8 text-blue-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const resetUpload = () => {
    setFiles([])
    setUploadProgress(0)
    setUploadComplete(false)
    setUploadError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Emission Data</CardTitle>
        <CardDescription>Upload files or manually enter data to calculate carbon emissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" onValueChange={(value) => setUploadMethod(value as "file" | "manual")}>
          <TabsList className="mb-6">
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            {uploadComplete ? (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-800 rounded-full p-4 inline-flex mb-4">
                  <FileUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your files have been uploaded and are being processed. You'll receive a notification when the analysis
                  is complete.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetUpload}>Upload More Files</Button>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/dashboard/upload">View Emission Data</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {uploadError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
                    dragging ? "border-green-500 bg-green-50" : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drag and drop files here</h3>
                  <p className="text-gray-500 mb-4">Support for PDF, Excel, CSV, and image files</p>
                  <div className="flex justify-center">
                    <Input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
                    />
                    <Label htmlFor="file-upload" asChild>
                      <Button variant="outline">Browse Files</Button>
                    </Label>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center p-3 rounded-lg border border-gray-200">
                          {getFileIcon(file)}
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleUpload}
                    disabled={files.length === 0 || uploading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {uploading ? "Uploading..." : "Upload Files"}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="manual">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emission-type">Emission Type</Label>
                  <Select>
                    <SelectTrigger id="emission-type">
                      <SelectValue placeholder="Select emission type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity Consumption</SelectItem>
                      <SelectItem value="fuel">Fuel Consumption</SelectItem>
                      <SelectItem value="travel">Business Travel</SelectItem>
                      <SelectItem value="waste">Waste Management</SelectItem>
                      <SelectItem value="water">Water Consumption</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-unit">Business Unit</Label>
                  <Select>
                    <SelectTrigger id="business-unit">
                      <SelectValue placeholder="Select business unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="headquarters">Headquarters</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing Plant A</SelectItem>
                      <SelectItem value="retail">Retail Stores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" id="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input type="number" id="quantity" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input type="number" id="amount" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kwh">kWh</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="km">Kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Additional information" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">Save Entry</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

