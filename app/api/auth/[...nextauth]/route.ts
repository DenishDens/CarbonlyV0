import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// NOTE: NextAuth is configured with a temporary secret for development
// In production, use proper environment variables: NEXTAUTH_SECRET

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

