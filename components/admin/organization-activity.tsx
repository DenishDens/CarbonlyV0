import { Building2, FileText, Users } from "lucide-react"

const activityData = [
  {
    id: "1",
    organization: "Acme Corp",
    action: "Created new project",
    time: "2 hours ago",
    icon: FileText,
  },
  {
    id: "2",
    organization: "GreenTech",
    action: "Added 5 team members",
    time: "4 hours ago",
    icon: Users,
  },
  {
    id: "3",
    organization: "EcoFriendly",
    action: "Uploaded emission data",
    time: "6 hours ago",
    icon: FileText,
  },
  {
    id: "4",
    organization: "Sustainable Inc",
    action: "Updated organization profile",
    time: "10 hours ago",
    icon: Building2,
  },
  {
    id: "5",
    organization: "Green Future",
    action: "Generated carbon report",
    time: "12 hours ago",
    icon: FileText,
  },
  {
    id: "6",
    organization: "Carbon Zero",
    action: "Set reduction targets",
    time: "18 hours ago",
    icon: FileText,
  },
]

export function OrganizationActivity() {
  return (
    <div className="space-y-4">
      {activityData.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <activity.icon className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.organization}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="text-sm text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}

