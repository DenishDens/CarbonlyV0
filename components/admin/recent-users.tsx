import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentUsers = [
  {
    id: "1",
    name: "Emma Wilson",
    email: "emma@acmecorp.com",
    organization: "Acme Corp",
    status: "active",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    joinedAt: "2 days ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@greentech.io",
    organization: "GreenTech",
    status: "pending",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    joinedAt: "3 days ago",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah@ecofriendly.com",
    organization: "EcoFriendly",
    status: "active",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    joinedAt: "5 days ago",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@sustainableinc.com",
    organization: "Sustainable Inc",
    status: "active",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    joinedAt: "6 days ago",
  },
  {
    id: "5",
    name: "Lisa Patel",
    email: "lisa@greenfuture.org",
    organization: "Green Future",
    status: "pending",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    joinedAt: "7 days ago",
  },
]

export function RecentUsers() {
  return (
    <div className="space-y-4">
      {recentUsers.map((user) => (
        <div key={user.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={user.status === "active" ? "default" : "outline"}>
            {user.status === "active" ? "Active" : "Pending"}
          </Badge>
        </div>
      ))}
    </div>
  )
}

