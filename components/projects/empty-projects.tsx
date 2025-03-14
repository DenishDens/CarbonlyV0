import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

interface EmptyProjectsProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
}

export function EmptyProjects({
  title = "No projects found",
  description = "Create your first project to start tracking your carbon footprint.",
  buttonText = "New Project",
  buttonHref = "/dashboard/projects/new",
}: EmptyProjectsProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PlusIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-center text-muted-foreground">{description}</p>
      <Link href={buttonHref} className="mt-6">
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}

