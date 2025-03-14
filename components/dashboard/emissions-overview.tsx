"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react"

export default function EmissionsOverview() {
  // Mock data - in a real app, this would come from your API
  const emissionsData = {
    total: 1250.75,
    change: -12.5,
    scope1: 320.45,
    scope1Change: -8.2,
    scope2: 580.3,
    scope2Change: -15.7,
    scope3: 350.0,
    scope3Change: -10.3,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissions Overview</CardTitle>
        <CardDescription>Track your organization's carbon emissions across all scopes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Scopes</TabsTrigger>
            <TabsTrigger value="scope1">Scope 1</TabsTrigger>
            <TabsTrigger value="scope2">Scope 2</TabsTrigger>
            <TabsTrigger value="scope3">Scope 3</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <EmissionMetricCard
                title="Total Emissions"
                value={`${emissionsData.total.toFixed(2)} tCO₂e`}
                change={emissionsData.change}
                description="Last 30 days"
              />
              <EmissionMetricCard
                title="Scope 1 Emissions"
                value={`${emissionsData.scope1.toFixed(2)} tCO₂e`}
                change={emissionsData.scope1Change}
                description="Direct emissions"
              />
              <EmissionMetricCard
                title="Scope 2 Emissions"
                value={`${emissionsData.scope2.toFixed(2)} tCO₂e`}
                change={emissionsData.scope2Change}
                description="Indirect emissions"
              />
              <EmissionMetricCard
                title="Scope 3 Emissions"
                value={`${emissionsData.scope3.toFixed(2)} tCO₂e`}
                change={emissionsData.scope3Change}
                description="Value chain emissions"
              />
            </div>

            <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Emissions trend chart would appear here</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scope1">
            <div className="space-y-4">
              <EmissionMetricCard
                title="Scope 1 Emissions"
                value={`${emissionsData.scope1.toFixed(2)} tCO₂e`}
                change={emissionsData.scope1Change}
                description="Direct emissions from owned sources"
                large
              />
              <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Scope 1 emissions breakdown would appear here</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scope2">
            <div className="space-y-4">
              <EmissionMetricCard
                title="Scope 2 Emissions"
                value={`${emissionsData.scope2.toFixed(2)} tCO₂e`}
                change={emissionsData.scope2Change}
                description="Indirect emissions from purchased electricity, steam, heating and cooling"
                large
              />
              <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Scope 2 emissions breakdown would appear here</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scope3">
            <div className="space-y-4">
              <EmissionMetricCard
                title="Scope 3 Emissions"
                value={`${emissionsData.scope3.toFixed(2)} tCO₂e`}
                change={emissionsData.scope3Change}
                description="All other indirect emissions in the value chain"
                large
              />
              <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Scope 3 emissions breakdown would appear here</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface EmissionMetricCardProps {
  title: string
  value: string
  change: number
  description: string
  large?: boolean
}

function EmissionMetricCard({ title, value, change, description, large = false }: EmissionMetricCardProps) {
  const isPositive = change >= 0

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-100 ${large ? "col-span-full" : ""}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className={`text-${large ? "3xl" : "2xl"} font-semibold text-gray-900`}>{value}</p>
        <p className={`ml-2 flex items-center text-sm font-medium ${isPositive ? "text-red-600" : "text-green-600"}`}>
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1 flex-shrink-0" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1 flex-shrink-0" />
          )}
          {Math.abs(change)}%
        </p>
      </div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  )
}

