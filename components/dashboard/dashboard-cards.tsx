"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, BarChart3, Leaf, TrendingDown, TrendingUp } from "lucide-react"

interface DashboardCardsProps {
  data?: {
    totalEmissions?: number
    emissionsChange?: number
    activeProjects?: number
    projectsChange?: number
    carbonIntensity?: number
    intensityChange?: number
    reductionTarget?: number
    targetProgress?: number
  }
}

export function DashboardCards({
  data = {
    totalEmissions: 1250,
    emissionsChange: -8.2,
    activeProjects: 12,
    projectsChange: 2,
    carbonIntensity: 0.42,
    intensityChange: -5.3,
    reductionTarget: 30,
    targetProgress: 27.5,
  },
}: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalEmissions.toLocaleString()} tCO₂e</div>
          <p className="text-xs text-muted-foreground">
            {data.emissionsChange > 0 ? (
              <span className="flex items-center text-red-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                {Math.abs(data.emissionsChange)}% from last month
              </span>
            ) : (
              <span className="flex items-center text-green-500">
                <ArrowDown className="mr-1 h-4 w-4" />
                {Math.abs(data.emissionsChange)}% from last month
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            {data.projectsChange > 0 ? (
              <span className="flex items-center text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                {data.projectsChange} new this month
              </span>
            ) : data.projectsChange < 0 ? (
              <span className="flex items-center text-red-500">
                <TrendingDown className="mr-1 h-4 w-4" />
                {Math.abs(data.projectsChange)} less this month
              </span>
            ) : (
              <span className="flex items-center">No change from last month</span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Carbon Intensity</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.carbonIntensity} tCO₂e/$M</div>
          <p className="text-xs text-muted-foreground">
            {data.intensityChange > 0 ? (
              <span className="flex items-center text-red-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                {Math.abs(data.intensityChange)}% from last quarter
              </span>
            ) : (
              <span className="flex items-center text-green-500">
                <ArrowDown className="mr-1 h-4 w-4" />
                {Math.abs(data.intensityChange)}% from last quarter
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reduction Target</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.targetProgress}%</div>
          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div className="h-full rounded-full bg-green-500" style={{ width: `${data.targetProgress}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.targetProgress}% of {data.reductionTarget}% target
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

