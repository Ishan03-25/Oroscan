import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: patientId } = await params

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        responses: {
          include: {
            question: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
        diagnoses: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Check authorization: users can only see their own screenings (except admins/doctors)
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Health assistants can only see screenings they created
    if (user.role === 'HEALTH_ASSISTANT' && patient.createdBy !== user.username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formattedPatient = {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      healthAssistant: patient.healthAssistant,
      createdBy: patient.createdBy,
      createdAt: patient.createdAt.toISOString(),
      responses: patient.responses.map((r) => ({
        id: r.id,
        answer: r.answer,
        question: {
          id: r.question.id,
          text: r.question.text,
          category: r.question.category,
          type: r.question.type,
        },
      })),
      images: patient.images.map((img) => ({
        id: img.id,
        url: img.url,
        type: img.type,
        createdAt: img.createdAt.toISOString(),
      })),
      diagnoses: patient.diagnoses.map((d) => ({
        id: d.id,
        result: d.result,
        confidence: d.confidence,
        createdAt: d.createdAt.toISOString(),
      })),
    }

    return NextResponse.json({ patient: formattedPatient })
  } catch (error) {
    console.error("Failed to fetch patient details:", error)
    return NextResponse.json(
      { error: "Failed to fetch patient details" },
      { status: 500 }
    )
  }
}
