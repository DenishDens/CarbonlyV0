import { supabase } from "@/lib/supabase/client"

export interface MaterialMatch {
  id: string
  name: string
  category: string
  standardUnit: string
  emissionFactor: number
  confidence: number
}

export class MaterialMatcher {
  /**
   * Find the best match for a material description in the material library
   */
  public async findMatch(description: string): Promise<MaterialMatch | null> {
    try {
      // First try exact match
      const exactMatch = await this.findExactMatch(description)
      if (exactMatch) {
        return {
          ...exactMatch,
          confidence: 1.0,
        }
      }

      // Then try fuzzy match
      return await this.findFuzzyMatch(description)
    } catch (error) {
      console.error("Error matching material:", error)
      return null
    }
  }

  /**
   * Find an exact match in the material library
   */
  private async findExactMatch(description: string): Promise<MaterialMatch | null> {
    const { data, error } = await supabase
      .from("material_library")
      .select("id, name, category, standard_unit, emission_factor")
      .or(`name.eq.${description},aliases.cs.{${description}}`)
      .limit(1)

    if (error || !data || data.length === 0) {
      return null
    }

    return {
      id: data[0].id,
      name: data[0].name,
      category: data[0].category,
      standardUnit: data[0].standard_unit,
      emissionFactor: data[0].emission_factor,
      confidence: 1.0,
    }
  }

  /**
   * Find a fuzzy match in the material library
   */
  private async findFuzzyMatch(description: string): Promise<MaterialMatch | null> {
    // Normalize the description
    const normalizedDesc = description.toLowerCase().trim()

    // Get potential matches using text search
    const { data, error } = await supabase
      .from("material_library")
      .select("id, name, category, standard_unit, emission_factor, aliases")
      .textSearch("name", normalizedDesc, {
        config: "english",
        type: "websearch",
      })
      .limit(5)

    if (error || !data || data.length === 0) {
      return null
    }

    // Calculate similarity scores
    const matches = data.map((item) => {
      const nameScore = this.calculateSimilarity(normalizedDesc, item.name.toLowerCase())

      // Check aliases for better matches
      let aliasScore = 0
      if (item.aliases && Array.isArray(item.aliases)) {
        for (const alias of item.aliases) {
          const score = this.calculateSimilarity(normalizedDesc, alias.toLowerCase())
          if (score > aliasScore) {
            aliasScore = score
          }
        }
      }

      // Use the better score
      const confidence = Math.max(nameScore, aliasScore)

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        standardUnit: item.standard_unit,
        emissionFactor: item.emission_factor,
        confidence,
      }
    })

    // Sort by confidence and return the best match
    matches.sort((a, b) => b.confidence - a.confidence)
    return matches[0]
  }

  /**
   * Calculate similarity between two strings (0-1)
   * Using Levenshtein distance normalized by the longer string length
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length
    const len2 = str2.length

    // Quick check for exact match
    if (str1 === str2) return 1

    // Quick check for completely different strings
    if (len1 === 0 || len2 === 0) return 0

    // Initialize the distance matrix
    const matrix: number[][] = Array(len1 + 1)
      .fill(null)
      .map(() => Array(len2 + 1).fill(null))

    // Initialize first row and column
    for (let i = 0; i <= len1; i++) matrix[i][0] = i
    for (let j = 0; j <= len2; j++) matrix[0][j] = j

    // Fill the matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost, // substitution
        )
      }
    }

    // Calculate similarity score (0-1)
    const maxLen = Math.max(len1, len2)
    const distance = matrix[len1][len2]
    return 1 - distance / maxLen
  }
}

