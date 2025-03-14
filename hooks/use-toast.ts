// Re-export the simple toast hook
export { useSimpleToast as useToast } from "../components/simple-toast"

// Create a toast function that matches the original API
import { useSimpleToast } from "../components/simple-toast"

// Create a toast function that can be imported directly
export function toast(props: { title?: string; description?: string; variant?: "default" | "destructive" }) {
  // This is a placeholder that will be replaced by the actual implementation
  // when the hook is used within a component
  console.warn("Toast called outside of a component. Make sure you're using the toast function within a component that's wrapped with SimpleToastProvider.")
  return { id: "1", dismiss: () => {} }
}

// Export the hook for use in components
export { useSimpleToast }

