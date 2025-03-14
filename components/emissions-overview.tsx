"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEmissions } from "@/hooks/use-emissions"
import { formatNumber } from "@/lib/utils"
import { ArrowDown, ArrowUp, Loader2, TrendingUp } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"

export function EmissionsOverview() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    end: new Date().toISOString(),
  })

  const { data, isLoading, error } = useEmissions(dateRange)

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
          Failed to load emissions data. Please try again later.
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <TrendingUp className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">No emissions data available</p>
            <p className="text-sm text-muted-foreground">Start by adding your first emission record</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Emissions Overview</h2>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          className="w-[300px]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Emissions
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">
                {formatNumber(data.total)} tCO₂e
              </p>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  data.change >= 0 ? "text-destructive" : "text-green-500"
                }`}
              >
                {data.change >= 0 ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{Math.abs(data.change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Scope 1 Emissions
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">
                {formatNumber(data.scope1)} tCO₂e
              </p>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  data.scope1Change >= 0 ? "text-destructive" : "text-green-500"
                }`}
              >
                {data.scope1Change >= 0 ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{Math.abs(data.scope1Change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Scope 2 Emissions
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">
                {formatNumber(data.scope2)} tCO₂e
              </p>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  data.scope2Change >= 0 ? "text-destructive" : "text-green-500"
                }`}
              >
                {data.scope2Change >= 0 ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{Math.abs(data.scope2Change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Scope 3 Emissions
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">
                {formatNumber(data.scope3)} tCO₂e
              </p>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  data.scope3Change >= 0 ? "text-destructive" : "text-green-500"
                }`}
              >
                {data.scope3Change >= 0 ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{Math.abs(data.scope3Change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="total">
          <TabsList>
            <TabsTrigger value="total">Total</TabsTrigger>
            <TabsTrigger value="scope1">Scope 1</TabsTrigger>
            <TabsTrigger value="scope2">Scope 2</TabsTrigger>
            <TabsTrigger value="scope3">Scope 3</TabsTrigger>
          </TabsList>
          <TabsContent value="total" className="mt-4">
            <div className="h-[300px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Emissions trend chart coming soon
              </div>
            </div>
          </TabsContent>
          <TabsContent value="scope1" className="mt-4">
            <div className="h-[300px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Scope 1 trend chart coming soon
              </div>
            </div>
          </TabsContent>
          <TabsContent value="scope2" className="mt-4">
            <div className="h-[300px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Scope 2 trend chart coming soon
              </div>
            </div>
          </TabsContent>
          <TabsContent value="scope3" className="mt-4">
            <div className="h-[300px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Scope 3 trend chart coming soon
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

