"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables, type ChartType as ChartJsType } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface EmissionDataChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
    }[]
  }
  type?: string
}

export function EmissionDataChart({ data, type = "bar" }: EmissionDataChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Generate colors for the chart if not provided
    const datasets = data.datasets.map((dataset) => {
      if (dataset.backgroundColor && dataset.borderColor) {
        return dataset
      }

      const colors = data.labels.map((_, i) => {
        const hue = (i * 137) % 360 // Golden angle approximation for good distribution
        return `hsl(${hue}, 70%, 60%)`
      })

      return {
        ...dataset,
        backgroundColor: type === "line" ? "rgba(75, 192, 192, 0.2)" : colors,
        borderColor: type === "line" ? "rgba(75, 192, 192, 1)" : colors.map((color) => color.replace("60%", "50%")),
        borderWidth: 1,
        tension: type === "line" ? 0.1 : undefined,
      }
    })

    chartInstance.current = new Chart(ctx, {
      type: type as ChartJsType,
      data: {
        ...data,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type !== "pie" && type !== "doughnut",
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                const label = context.label || ""
                const datasetLabel = context.dataset.label || ""

                if (type === "pie" || type === "doughnut") {
                  const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value.toFixed(2)} tonnes CO2e (${percentage}%)`
                }

                return `${datasetLabel}: ${value.toFixed(2)} tonnes CO2e`
              },
            },
          },
        },
        scales:
          type !== "pie" && type !== "doughnut"
            ? {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Emissions (tonnes CO2e)",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: type === "bar" ? "Category" : "Time Period",
                  },
                },
              }
            : undefined,
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type])

  return <canvas ref={chartRef} />
}

