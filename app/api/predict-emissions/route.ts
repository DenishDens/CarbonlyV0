import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { historicalData, timeframe } = await req.json()

    if (!historicalData || !timeframe) {
      return NextResponse.json({ error: "Historical data and timeframe are required" }, { status: 400 })
    }

    // Use AI to predict future emissions based on historical data
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Based on the following historical carbon emissions data, predict the emissions for the next ${timeframe}.
        Analyze trends, seasonality, and potential factors affecting emissions.
        Format the response as JSON with the following structure:
        {
          "predictions": [
            {
              "period": "string",
              "predictedEmissions": number,
              "lowerBound": number,
              "upperBound": number
            }
          ],
          "trend": "increasing" | "decreasing" | "stable",
          "confidenceLevel": number,
          "factors": ["string"],
          "recommendations": ["string"]
        }
        
        Historical data:
        ${JSON.stringify(historicalData)}
      `,
    })

    // Parse the AI response
    const predictionResult = JSON.parse(text)

    return NextResponse.json(predictionResult)
  } catch (error) {
    console.error("Error predicting emissions:", error)
    return NextResponse.json({ error: "Failed to predict future emissions" }, { status: 500 })
  }
}

