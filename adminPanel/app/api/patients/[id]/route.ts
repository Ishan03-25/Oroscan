import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
      include: {
        responses: {
          include: {
            question: true,
          },
        },
        images: {
          orderBy: {
            createdAt: "desc",
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
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      )
    }

    const formattedPatient = {
      ...patient,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
      responses: patient.responses.map((r: any) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        question: {
          ...r.question,
          createdAt: r.question.createdAt.toISOString(),
          updatedAt: r.question.updatedAt.toISOString(),
        },
      })),
      images: patient.images.map((i: any) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
      diagnoses: patient.diagnoses.map((d: any) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
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
