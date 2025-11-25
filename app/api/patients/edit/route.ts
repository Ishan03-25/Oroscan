import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("id")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        responses: {
          include: {
            question: true,
          },
        },
        images: true,
      },
    })

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Check authorization
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Health assistants can only edit screenings they created
    if (user.role === 'HEALTH_ASSISTANT' && patient.createdBy !== user.username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Organize responses by category
    const medicalAnswers: Record<string, string> = {}
    const familyAnswers: Record<string, string> = {}
    const featureAnswers: Record<string, string> = {}

    patient.responses.forEach((response) => {
      const answer = response.answer
      switch (response.question.category) {
        case "medical":
          medicalAnswers[response.question.id] = answer
          break
        case "family":
          familyAnswers[response.question.id] = answer
          break
        case "features":
          featureAnswers[response.question.id] = answer
          break
      }
    })

    const formattedPatient = {
      id: patient.id,
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      phone: patient.phone,
      healthAssistant: patient.healthAssistant || "",
      address: patient.address,
      medicalAnswers,
      familyAnswers,
      featureAnswers,
      images: patient.images.map((img) => ({
        id: img.id,
        url: img.url,
        type: img.type,
      })),
    }

    return NextResponse.json({ patient: formattedPatient })
  } catch (error) {
    console.error("Failed to fetch patient for edit:", error)
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    )
  }
}
