import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

// List of paths that don't require authentication
const publicPaths = ["/login", "/register", "/", "/api/auth"]

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const { supabase, response } = createClient(request)

  // Refresh session if expired
  await supabase.auth.getSession()

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for a public path
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`),
  )

  // If the user is not signed in and the path requires auth, redirect to login
  if (!session && !isPublicPath) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is signed in and trying to access login/register, redirect to dashboard
  if (session && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Add security headers
  const headers = new Headers(response.headers)
  headers.set('Permissions-Policy', 'clipboard-write=(self)')
  headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none')
  headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  // For Server Actions, we need to ensure the host headers match
  if (request.method === 'POST' && request.headers.get('x-forwarded-host')) {
    headers.set('x-forwarded-host', new URL(request.url).host)
  }

  // Create a new response with the modified headers
  const finalResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })

  return finalResponse
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
