import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className={cn(
          "animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4",
          className
        )} />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
} 