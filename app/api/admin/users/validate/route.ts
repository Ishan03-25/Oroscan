import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    // Find user and check if they are a health assistant
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({
        isValid: false,
        message: "User not found",
      })
    }

    if (user.role !== "HEALTH_ASSISTANT") {
      return NextResponse.json({
        isValid: false,
        message: "User is not a Health Assistant",
      })
    }

    return NextResponse.json({
      isValid: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Failed to validate user:", error)
    return NextResponse.json(
      { error: "Failed to validate user" },
      { status: 500 }
    )
  }
}
