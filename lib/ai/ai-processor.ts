import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { supabase } from "@/lib/supabase/client"

export interface AIProcessingResult {
  materialId: string
  materialName: string
  category: string
  standardUnit: string
  emissionFactor: number
  confidence: number
}

export class AIProcessor {
  /**
   * Process a material description using AI to identify and categorize it
   */
  public async processMaterial(description: string, quantity: number, unit?: string): Promise<AIProcessingResult> {
    try {
      // First check if we have processed this description before
      const cachedResult = await this.getCachedResult(description)
      if (cachedResult) {
        return cachedResult
      }

      // Prepare the prompt for the AI
      const prompt = `
        Analyze the following material description and identify the most likely material category, 
        standard unit of measure, and emission factor.
        
        Material Description: "${description}"
        Quantity: ${quantity}
        Unit: ${unit || "Not specified"}
        
        Respond in JSON format with the following fields:
        - materialName: The standardized name of the material
        - category: The category (e.g., "steel", "aluminum", "electricity", "natural_gas", "concrete", etc.)
        - standardUnit: The standard unit of measure for this material
        - emissionFactor: Estimated emission factor (CO2e per unit)
        - confidence: Your confidence in this classification (0.0-1.0)
      `

      // Call the AI model
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.2,
        maxTokens: 500,
      })

      // Parse the response
      let result: AIProcessingResult

      try {
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error("No JSON found in AI response")
        }

        const parsedResult = JSON.parse(jsonMatch[0])

        result = {
          materialId: `ai-${Date.now()}`, // Temporary ID
          materialName: parsedResult.materialName,
          category: parsedResult.category,
          standardUnit: parsedResult.standardUnit,
          emissionFactor: parsedResult.emissionFactor,
          confidence: parsedResult.confidence,
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError)

        // Fallback result with low confidence
        result = {
          materialId: `ai-${Date.now()}`,
          materialName: description,
          category: "unknown",
          standardUnit: unit || "kg",
          emissionFactor: 0,
          confidence: 0.1,
        }
      }

      // Cache the result for future use
      await this.cacheResult(description, result)

      return result
    } catch (error) {
      console.error("AI processing error:", error)

      // Return a fallback result
      return {
        materialId: `ai-${Date.now()}`,
        materialName: description,
        category: "unknown",
        standardUnit: unit || "kg",
        emissionFactor: 0,
        confidence: 0,
      }
    }
  }

  /**
   * Get cached AI processing result
   */
  private async getCachedResult(description: string): Promise<AIProcessingResult | null> {
    const { data, error } = await supabase
      .from("ai_processing_cache")
      .select("result")
      .eq("description", description.toLowerCase().trim())
      .limit(1)

    if (error || !data || data.length === 0) {
      return null
    }

    return data[0].result as AIProcessingResult
  }

  /**
   * Cache AI processing result
   */
  private async cacheResult(description: string, result: AIProcessingResult): Promise<void> {
    await supabase.from("ai_processing_cache").upsert({
      description: description.toLowerCase().trim(),
      result,
      created_at: new Date().toISOString(),
    })
  }
}

