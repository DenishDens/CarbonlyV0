"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Sample data - in a real app, this would come from props
const monthlyData = [
  { name: "Jan", scope1: 65, scope2: 120, scope3: 180 },
  { name: "Feb", scope1: 59, scope2: 110, scope3: 175 },
  { name: "Mar", scope1: 80, scope2: 130, scope3: 190 },
  { name: "Apr", scope1: 81, scope2: 105, scope3: 185 },
  { name: "May", scope1: 56, scope2: 95, scope3: 170 },
  { name: "Jun", scope1: 55, scope2: 90, scope3: 165 },
  { name: "Jul", scope1: 40, scope2: 85, scope3: 160 },
  { name: "Aug", scope1: 45, scope2: 95, scope3: 170 },
  { name: "Sep", scope1: 62, scope2: 110, scope3: 180 },
  { name: "Oct", scope1: 58, scope2: 105, scope3: 175 },
  { name: "Nov", scope1: 70, scope2: 115, scope3: 185 },
  { name: "Dec", scope1: 75, scope2: 125, scope3: 195 },
]

const quarterlyData = [
  { name: "Q1", scope1: 204, scope2: 360, scope3: 545 },
  { name: "Q2", scope1: 192, scope2: 290, scope3: 520 },
  { name: "Q3", scope1: 147, scope2: 290, scope3: 510 },
  { name: "Q4", scope1: 203, scope2: 345, scope3: 555 },
]

const yearlyData = [
  { name: "2020", scope1: 800, scope2: 1400, scope3: 2200 },
  { name: "2021", scope1: 750, scope2: 1350, scope3: 2100 },
  { name: "2022", scope1: 700, scope2: 1300, scope3: 2000 },
  { name: "2023", scope1: 650, scope2: 1250, scope3: 1900 },
]

interface EmissionsChartProps {
  className?: string
}

export function EmissionsChart({ className }: EmissionsChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Emissions Overview</CardTitle>
        <CardDescription>Track your carbon emissions across all scopes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-xs text-muted-foreground">Scope 1</span>
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Scope 2</span>
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-xs text-muted-foreground">Scope 3</span>
              </div>
            </div>
          </div>
          <TabsContent value="monthly" className="mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scope1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scope2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scope3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="scope1" stroke="#3b82f6" fillOpacity={1} fill="url(#scope1)" />
                <Area type="monotone" dataKey="scope2" stroke="#22c55e" fillOpacity={1} fill="url(#scope2)" />
                <Area type="monotone" dataKey="scope3" stroke="#f59e0b" fillOpacity={1} fill="url(#scope3)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="quarterly" className="mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scope1" stackId="a" fill="#3b82f6" />
                <Bar dataKey="scope2" stackId="a" fill="#22c55e" />
                <Bar dataKey="scope3" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="yearly" className="mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scope1" fill="#3b82f6" />
                <Bar dataKey="scope2" fill="#22c55e" />
                <Bar dataKey="scope3" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

