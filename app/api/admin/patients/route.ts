import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        diagnoses: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        responses: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })

    const formattedPatients = patients.map((patient: any) => ({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      healthAssistant: patient.healthAssistant,
      createdAt: patient.createdAt.toISOString(),
      diagnosis: patient.diagnoses[0] ? {
        result: patient.diagnoses[0].result,
        confidence: patient.diagnoses[0].confidence,
      } : null,
      responses: patient.responses.map((r: any) => ({
        questionId: r.questionId,
        answer: r.answer,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    }))

    return NextResponse.json({ patients: formattedPatients })
  } catch (error) {
    console.error("Failed to fetch patients:", error)
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    )
  }
}
