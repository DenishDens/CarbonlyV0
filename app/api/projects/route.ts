import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { logger } from "@/lib/logger"

const supabase = createClient()

export async function GET() {
  try {
    logger.info("API", "Fetching projects")
    
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    logger.info("API", "Successfully fetched projects", { count: projects.length })
    return NextResponse.json(projects)
  } catch (error) {
    logger.error("API", "Unexpected error in GET /api/projects", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    logger.info("API", "Creating new project")
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError || !session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, description, organizationId, projectType = "project", parentId } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!organizationId) {
      return new NextResponse("Organization ID is required", { status: 400 })
    }

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        organization_id: organizationId,
        project_type: projectType,
        parent_id: parentId,
        user_id: session.user.id,
        status: "draft",
        progress: 0
      })
      .select()
      .single()

    if (error) {
      logger.error("API", "Error creating project", error)
      return new NextResponse(error.message, { status: 400 })
    }

    logger.info("API", "Successfully created project", { projectId: project.id })
    return NextResponse.json(project)
  } catch (error) {
    logger.error("API", "Unexpected error in POST /api/projects", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

