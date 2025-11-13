import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    // Get the diagnosis for the patient
    const diagnosis = await prisma.diagnosis.findFirst({
      where: {
        patientId: patientId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!diagnosis) {
      return NextResponse.json({ error: "No results found" }, { status: 404 })
    }

    return NextResponse.json({
      patientId: patientId,
      diagnosis: {
        result: diagnosis.result,
        confidence: diagnosis.confidence,
        metadata: diagnosis.metadata,
      },
    })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}