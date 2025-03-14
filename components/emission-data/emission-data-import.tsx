"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-import/file-upload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, CloudUpload, Database, FileSpreadsheet, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ProcessingResult } from "@/lib/file-processing/file-processor"

export function EmissionDataImport() {
  const [activeTab, setActiveTab] = useState("file")
  const [importComplete, setImportComplete] = useState(false)
  const [importStats, setImportStats] = useState<{
    total: number
    matched: number
    unmatched: number
    needsReview: number
  } | null>(null)

  const { toast } = useToast()

  const handleImportComplete = (result: ProcessingResult) => {
    // In a real app, this would call an API to save the processed data
    console.log("Import complete:", result)

    setImportStats({
      total: result.totalRecords || 0,
      matched: result.data.matched.length,
      unmatched: result.data.unmatched.length,
      needsReview: result.data.needsReview.length,
    })

    setImportComplete(true)

    toast({
      title: "Import Complete",
      description: `Successfully processed ${result.totalRecords} records`,
    })
  }

  const resetImport = () => {
    setImportComplete(false)
    setImportStats(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Emission Data</CardTitle>
        <CardDescription>Upload files or connect to external systems to import emission data</CardDescription>
      </CardHeader>

      <CardContent>
        {importComplete ? (
          <div className="text-center py-8">
            <div className="bg-green-100 text-green-800 rounded-full p-4 inline-flex mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Import Complete!</h3>
            <p className="text-muted-foreground mb-6">Your data has been successfully imported and processed.</p>

            {importStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-2xl font-bold">{importStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">{importStats.matched}</div>
                  <div className="text-sm text-green-600">Matched</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-700">{importStats.needsReview}</div>
                  <div className="text-sm text-yellow-600">Needs Review</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-700">{importStats.unmatched}</div>
                  <div className="text-sm text-red-600">Unmatched</div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={resetImport}>
                Import More Data
              </Button>
              <Button>View Imported Data</Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="file" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="cloud">
                <CloudUpload className="h-4 w-4 mr-2" />
                Cloud Import
              </TabsTrigger>
              <TabsTrigger value="integration">
                <Database className="h-4 w-4 mr-2" />
                Integrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="mt-6">
              <FileUpload organizationId="org123" projectId="proj456" onComplete={handleImportComplete} />
            </TabsContent>

            <TabsContent value="cloud" className="mt-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Cloud Import</AlertTitle>
                <AlertDescription>
                  Connect to cloud storage services like Google Drive, Dropbox, or OneDrive to import your emission data
                  files.
                </AlertDescription>
              </Alert>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <div className="rounded-full bg-blue-100 p-3 inline-flex mb-4">
                      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 11v2h2v2H9v-4h3zm1-9c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S18.5 2 13 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Google Drive</h3>
                    <p className="text-sm text-muted-foreground">Connect and import files</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <div className="rounded-full bg-blue-100 p-3 inline-flex mb-4">
                      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Dropbox</h3>
                    <p className="text-sm text-muted-foreground">Connect and import files</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <div className="rounded-full bg-blue-100 p-3 inline-flex mb-4">
                      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">OneDrive</h3>
                    <p className="text-sm text-muted-foreground">Connect and import files</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="mt-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Data Integrations</AlertTitle>
                <AlertDescription>
                  Connect directly to your existing systems to automatically import emission data.
                </AlertDescription>
              </Alert>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <div className="rounded-full bg-green-100 p-3 inline-flex mb-4">
                      <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V8l6.94 4.34c.65.41 1.47.41 2.12 0L20 8v9c0 .55-.45 1-1 1zm-7-7L4 6h16l-8 5z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Utility Data</h3>
                    <p className="text-sm text-muted-foreground">Connect to utility providers</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <div className="rounded-full bg-green-100 p-3 inline-flex mb-4">
                      <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">ERP Systems</h3>
                    <p className="text-sm text-muted-foreground">Connect to SAP, Oracle, etc.</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <div className="rounded-full bg-green-100 p-3 inline-flex mb-4">
                      <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">API Integration</h3>
                    <p className="text-sm text-muted-foreground">Custom API connections</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

