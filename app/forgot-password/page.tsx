import type { Metadata } from "next"
import ForgotPasswordClient from "./forgot-password-client"

/**
 * Metadata for the Forgot Password page
 * This improves SEO and provides proper page information in browser tabs
 */
export const metadata: Metadata = {
  title: "Forgot Password | Carbonly.ai",
  description: "Reset your Carbonly.ai account password",
}

/**
 * Server Component for the Forgot Password page
 *
 * This component serves as the entry point for the forgot password functionality.
 * It uses a client component for the interactive form elements.
 *
 * Note: Keep this as a server component to benefit from:
 * - Improved SEO through metadata
 * - Faster initial page load
 * - Reduced client-side JavaScript
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />
}

