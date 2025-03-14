"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import "chartjs-plugin-annotation"

// Register Chart.js components
Chart.register(...registerables)

interface PredictionChartProps {
  chartData: {
    type: string
    data: {
      labels: string[]
      datasets: {
        label: string
        data: number[]
        borderColor: string
        backgroundColor: string
      }[]
    }
  }
  prediction: {
    data: any[]
    methodology: string
    confidence: number
  }
}

export function PredictionChart({ chartData, prediction }: PredictionChartProps) {
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

    // Find where prediction starts
    const predictionStartIndex = chartData.data.datasets[0].data.length - prediction.data.length

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: chartData.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                const datasetLabel = context.dataset.label || ""
                return `${datasetLabel}: ${value.toFixed(2)} tonnes CO2e`
              },
              footer: (tooltipItems) => {
                const dataIndex = tooltipItems[0].dataIndex
                if (dataIndex >= predictionStartIndex) {
                  return `Confidence: ${(prediction.confidence * 100).toFixed(0)}%`
                }
                return ""
              },
            },
          },
          annotation: {
            annotations: {
              line1: {
                type: "line",
                xMin: predictionStartIndex - 0.5,
                xMax: predictionStartIndex - 0.5,
                borderColor: "rgba(0, 0, 0, 0.5)",
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  display: true,
                  content: "Prediction starts",
                  position: "start",
                },
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: "Emissions (tonnes CO2e)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time Period",
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartData, prediction])

  return (
    <div className="h-full flex flex-col">
      <canvas ref={chartRef} className="flex-1" />
      <div className="mt-2 text-xs text-muted-foreground">
        <span className="font-medium">Methodology:</span> {prediction.methodology} |
        <span className="font-medium ml-2">Confidence:</span> {(prediction.confidence * 100).toFixed(0)}%
      </div>
    </div>
  )
}

