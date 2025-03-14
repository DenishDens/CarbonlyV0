"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const subscriptionData = [
  {
    name: "Jan",
    Free: 65,
    Basic: 28,
    Pro: 15,
    Enterprise: 5,
  },
  {
    name: "Feb",
    Free: 72,
    Basic: 32,
    Pro: 19,
    Enterprise: 6,
  },
  {
    name: "Mar",
    Free: 78,
    Basic: 38,
    Pro: 24,
    Enterprise: 8,
  },
  {
    name: "Apr",
    Free: 85,
    Basic: 42,
    Pro: 28,
    Enterprise: 10,
  },
  {
    name: "May",
    Free: 91,
    Basic: 48,
    Pro: 32,
    Enterprise: 12,
  },
  {
    name: "Jun",
    Free: 100,
    Basic: 55,
    Pro: 38,
    Enterprise: 15,
  },
]

export function SubscriptionOverview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Free Plan</p>
          <p className="text-2xl font-bold">1,245</p>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Basic Plan</p>
          <p className="text-2xl font-bold">845</p>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Pro Plan</p>
          <p className="text-2xl font-bold">542</p>
          <p className="text-xs text-muted-foreground">+15% from last month</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Enterprise</p>
          <p className="text-2xl font-bold">221</p>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={subscriptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Free" fill="#94a3b8" />
            <Bar dataKey="Basic" fill="#64748b" />
            <Bar dataKey="Pro" fill="#475569" />
            <Bar dataKey="Enterprise" fill="#1e293b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

