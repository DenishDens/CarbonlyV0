import type { Metadata } from "next"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "Profile | Carbonly.ai",
  description: "Manage your profile settings",
}

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal profile settings and preferences.</p>
      </div>
      <ProfileForm userId={user.id} />
    </div>
  )
}

