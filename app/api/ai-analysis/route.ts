import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { fileContent, fileType } = await req.json()

    if (!fileContent) {
      return NextResponse.json({ error: "File content is required" }, { status: 400 })
    }

    // Use AI to analyze the file content for carbon emissions
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following ${fileType} content for carbon emissions data. 
        Extract any information related to energy consumption, fuel usage, travel distances, 
        or other activities that contribute to carbon emissions. 
        Calculate the approximate carbon emissions in tCO₂e based on standard emission factors.
        Format the response as JSON with the following structure:
        {
          "emissions": [
            {
              "activity": "string",
              "quantity": number,
              "unit": "string",
              "emissionFactor": number,
              "emissions": number
            }
          ],
          "totalEmissions": number,
          "confidence": number,
          "recommendations": ["string"]
        }
        
        Content to analyze:
        ${fileContent}
      `,
    })

    // Parse the AI response
    const analysisResult = JSON.parse(text)

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Error analyzing file:", error)
    return NextResponse.json({ error: "Failed to analyze file content" }, { status: 500 })
  }
}

