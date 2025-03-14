import { Leaf } from "lucide-react"
import Link from "next/link"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Leaf className="h-5 w-5 text-green-600" />
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-600/60 bg-clip-text text-transparent">
          Carbonly.ai
        </span>
      )}
    </Link>
  )
} 