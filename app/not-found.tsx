import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
      {/* Header */}
      <header className="container flex items-center justify-between py-4 px-4 md:px-6">
        <Logo className="text-white" />
      </header>

      {/* Main content */}
      <main className="container flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md mx-auto">
          {/* 404 visual */}
          <div className="relative mb-8">
            <div className="text-[150px] font-bold leading-none text-green-600 opacity-20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl md:text-5xl font-bold">Page Not Found</div>
            </div>
          </div>

          {/* Message */}
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>

          {/* Search suggestion */}
          <div className="relative mb-8">
            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
              <div className="pl-4">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for resources..."
                className="w-full px-4 py-3 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Navigation options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-6 text-center text-gray-400">
        <p>
          Need help?{" "}
          <Link href="#" className="text-green-500 hover:underline">
            Contact Support
          </Link>
        </p>
      </footer>
    </div>
  )
}

