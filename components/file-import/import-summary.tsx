import type { ProcessingResult } from "@/lib/file-processing/file-processor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilePreview } from "./file-preview"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, HelpCircle } from "lucide-react"

interface ImportSummaryProps {
  result: ProcessingResult
}

export function ImportSummary({ result }: ImportSummaryProps) {
  const { matched, unmatched, needsReview } = result.data
  const totalRecords = result.totalRecords || matched.length + unmatched.length + needsReview.length
  const aiProcessed = result.aiProcessed || 0

  const matchedPercent = Math.round((matched.length / totalRecords) * 100) || 0
  const unmatchedPercent = Math.round((unmatched.length / totalRecords) * 100) || 0
  const reviewPercent = Math.round((needsReview.length / totalRecords) * 100) || 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Matched
            </CardTitle>
            <CardDescription>Ready to import</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matched.length}</div>
            <div className="text-sm text-muted-foreground">{matchedPercent}% of records</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              Needs Review
            </CardTitle>
            <CardDescription>Requires your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsReview.length}</div>
            <div className="text-sm text-muted-foreground">{reviewPercent}% of records</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Unmatched
            </CardTitle>
            <CardDescription>Could not be processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unmatched.length}</div>
            <div className="text-sm text-muted-foreground">{unmatchedPercent}% of records</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Processing Summary</h3>
          <p className="text-sm text-muted-foreground">{totalRecords} total records processed</p>
        </div>

        {aiProcessed > 0 && (
          <Badge variant="outline" className="ml-auto">
            {aiProcessed} records processed with AI
          </Badge>
        )}
      </div>

      <Tabs defaultValue="matched">
        <TabsList>
          <TabsTrigger value="matched">Matched ({matched.length})</TabsTrigger>
          <TabsTrigger value="review">Needs Review ({needsReview.length})</TabsTrigger>
          <TabsTrigger value="unmatched">Unmatched ({unmatched.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="matched">
          {matched.length > 0 ? (
            <FilePreview data={matched} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">No matched records</div>
          )}
        </TabsContent>

        <TabsContent value="review">
          {needsReview.length > 0 ? (
            <FilePreview data={needsReview} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">No records need review</div>
          )}
        </TabsContent>

        <TabsContent value="unmatched">
          {unmatched.length > 0 ? (
            <FilePreview data={unmatched} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">No unmatched records</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

