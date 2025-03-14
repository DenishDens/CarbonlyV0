"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmissionDataTable } from "@/components/emission-data/emission-data-table"
import { EmissionDataImport } from "@/components/emission-data/emission-data-import"
import { EmissionDataVisualizer } from "@/components/emission-data/emission-data-visualizer"
import { EmissionDataManager } from "@/components/emission-data/emission-data-manager"

export function EmissionDataTabs() {
  const [activeTab, setActiveTab] = useState("view")

  return (
    <Tabs defaultValue="view" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="view">View Data</TabsTrigger>
        <TabsTrigger value="import">Import</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="visualize">Visualize</TabsTrigger>
      </TabsList>

      <TabsContent value="view" className="mt-6">
        <EmissionDataTable />
      </TabsContent>

      <TabsContent value="import" className="mt-6">
        <EmissionDataImport />
      </TabsContent>

      <TabsContent value="manual" className="mt-6">
        <EmissionDataManager />
      </TabsContent>

      <TabsContent value="visualize" className="mt-6">
        <EmissionDataVisualizer />
      </TabsContent>
    </Tabs>
  )
}

