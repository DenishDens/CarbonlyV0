import { Leaf } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-10 w-10 text-green-600" />
            <h1 className="text-3xl font-bold text-green-600">Carbonly</h1>
          </div>
          <h2 className="text-center text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-center text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-medium text-primary underline underline-offset-4 hover:text-primary/90">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

