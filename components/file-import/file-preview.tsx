import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FilePreviewProps {
  data: any[]
}

export function FilePreview({ data }: FilePreviewProps) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No data to preview</div>
  }

  // Get all unique keys from the data
  const allKeys = Array.from(new Set(data.flatMap((item) => Object.keys(item))))

  // Limit to first 10 columns for readability
  const displayKeys = allKeys.slice(0, 10)

  return (
    <div className="border rounded-md overflow-auto max-h-80">
      <Table>
        <TableHeader>
          <TableRow>
            {displayKeys.map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {displayKeys.map((key) => (
                <TableCell key={`${index}-${key}`}>{row[key] !== undefined ? String(row[key]) : ""}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

