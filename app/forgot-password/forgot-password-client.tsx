"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Logo } from "@/components/ui/logo"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

/**
 * Client Component for the Forgot Password functionality
 *
 * This component handles:
 * 1. Form state management
 * 2. Form validation
 * 3. API integration for password reset
 * 4. Success/error states
 */
export default function ForgotPasswordClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      setIsSubmitted(true)
      reset()
      toast({
        title: "Success!",
        description: "Password reset instructions have been sent to your email.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset instructions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center w-full max-w-md p-8 mx-auto">
        {/* Header section */}
        <div className="mb-8 text-center">
          <Logo className="inline-block mb-6" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Main card with form */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          {/* Conditional rendering based on form submission state */}
          {isSubmitted ? (
            // Success state - shown after form submission
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to your email address. The link will expire in 1 hour.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setIsSubmitted(false)
                  reset()
                }}
              >
                Try again
              </Button>
            </div>
          ) : (
            // Form state - shown initially
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  disabled={isLoading}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </div>

        {/* Back to login link */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

