"use client"

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface SingleValueCardProps {
  singleValue: {
    value: number
    unit: string
    label: string
    change?: {
      value: number
      percentage: number
      direction: "increase" | "decrease" | "no_change"
      comparedTo: string
    }
  }
}

export function SingleValueCard({ singleValue }: SingleValueCardProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-2xl font-medium text-muted-foreground mb-2">{singleValue.label}</div>

      <div className="text-5xl font-bold mb-4">
        {singleValue.value.toFixed(2)} <span className="text-2xl font-medium">{singleValue.unit}</span>
      </div>

      {singleValue.change && (
        <div className="flex items-center gap-2">
          {singleValue.change.direction === "increase" ? (
            <ArrowUpRight className="h-5 w-5 text-red-500" />
          ) : singleValue.change.direction === "decrease" ? (
            <ArrowDownRight className="h-5 w-5 text-green-500" />
          ) : (
            <Minus className="h-5 w-5 text-gray-500" />
          )}

          <span
            className={`font-medium ${
              singleValue.change.direction === "increase"
                ? "text-red-500"
                : singleValue.change.direction === "decrease"
                  ? "text-green-500"
                  : "text-gray-500"
            }`}
          >
            {Math.abs(singleValue.change.percentage).toFixed(2)}%
            {singleValue.change.direction === "increase"
              ? "increase"
              : singleValue.change.direction === "decrease"
                ? "decrease"
                : "no change"}
          </span>

          <span className="text-muted-foreground">vs. {singleValue.change.comparedTo}</span>
        </div>
      )}
    </div>
  )
}

