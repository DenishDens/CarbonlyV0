"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Download, Search, Filter, Loader2, FileUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"

export type EmissionRecord = {
  id: string
  organization_id: string
  project_id: string
  date: string
  total: number
  scope1: number
  scope2: number
  scope3: number
  created_at: string
  updated_at: string | null
}

export function EmissionDataManager() {
  const [activeTab, setActiveTab] = useState<"view" | "upload" | "manual">("view")
  const [records, setRecords] = useState<EmissionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchEmissionRecords() {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("emissions")
          .select("*")
          .order("date", { ascending: false })

        if (error) throw error

        setRecords(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch emission records")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmissionRecords()
  }, [])

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          {error}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emission Data Management</CardTitle>
        <CardDescription>Manage and track your organization's emission records</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="view">View Records</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px]"
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </div>

            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No emission records found</p>
                <p className="text-sm text-muted-foreground">Start by adding your first record or uploading data</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Scope 1</TableHead>
                    <TableHead>Scope 2</TableHead>
                    <TableHead>Scope 3</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.total.toFixed(2)} tCO₂e</TableCell>
                      <TableCell>{record.scope1.toFixed(2)} tCO₂e</TableCell>
                      <TableCell>{record.scope2.toFixed(2)} tCO₂e</TableCell>
                      <TableCell>{record.scope3.toFixed(2)} tCO₂e</TableCell>
                      <TableCell>
                        {record.updated_at
                          ? new Date(record.updated_at).toLocaleDateString()
                          : new Date(record.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center py-12">
              <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Upload Emission Data</p>
              <p className="text-sm text-muted-foreground">Drag and drop your file here or click to browse</p>
            </div>
          </TabsContent>

          <TabsContent value="manual">
            <div className="flex flex-col items-center justify-center py-12">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Manual Entry Form</p>
              <p className="text-sm text-muted-foreground">Enter emission data manually</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

