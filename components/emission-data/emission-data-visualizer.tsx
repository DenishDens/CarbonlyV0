"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  PieChart,
  LineChart,
  Download,
  Share2,
  BarChart3,
  PieChartIcon as PieIcon,
  LineChartIcon as LineIcon,
} from "lucide-react"

export function EmissionDataVisualizer() {
  const [chartType, setChartType] = useState("bar")
  const [timeRange, setTimeRange] = useState("year")
  const [category, setCategory] = useState("all")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emission Data Visualization</CardTitle>
        <CardDescription>Visualize and analyze your emission data with interactive charts</CardDescription>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="time-range">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="time-range">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="scope1">Scope 1</SelectItem>
                <SelectItem value="scope2">Scope 2</SelectItem>
                <SelectItem value="scope3">Scope 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="chart-type">Chart Type</Label>
            <Tabs value={chartType} onValueChange={setChartType} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bar">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bar
                </TabsTrigger>
                <TabsTrigger value="pie">
                  <PieIcon className="h-4 w-4 mr-2" />
                  Pie
                </TabsTrigger>
                <TabsTrigger value="line">
                  <LineIcon className="h-4 w-4 mr-2" />
                  Line
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">
          {chartType === "bar" && (
            <div className="text-center">
              <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Bar chart visualization would appear here</p>
            </div>
          )}

          {chartType === "pie" && (
            <div className="text-center">
              <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Pie chart visualization would appear here</p>
            </div>
          )}

          {chartType === "line" && (
            <div className="text-center">
              <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Line chart visualization would appear here</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">1,250.75</div>
              <p className="text-sm text-muted-foreground">Total Emissions (tCO₂e)</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">-12.5%</div>
              <p className="text-sm text-muted-foreground">Year-over-Year Change</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">42%</div>
              <p className="text-sm text-muted-foreground">Scope 3 Percentage</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

