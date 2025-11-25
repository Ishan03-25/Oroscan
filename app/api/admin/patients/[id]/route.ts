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
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()
    const {
      name,
      age,
      gender,
      phone,
      address,
      healthAssistant,
      medicalResponses,
      familyResponses,
      featureResponses,
    } = data

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    })

    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Update patient
    await prisma.patient.update({
      where: { id },
      data: {
        name,
        age: parseInt(age),
        gender,
        phone,
        address,
        healthAssistant,
      },
    })

    // Delete existing responses
    await prisma.response.deleteMany({
      where: { patientId: id },
    })

    // Prepare and store new responses
    const med = Array.isArray(medicalResponses) ? medicalResponses : []
    const fam = Array.isArray(familyResponses) ? familyResponses : []
    const feat = Array.isArray(featureResponses) ? featureResponses : []

    const allResponses = [...med, ...fam, ...feat]

    if (allResponses.length > 0) {
      const questionIds = Array.from(new Set(allResponses.map((r: any) => r.questionId)))

      const existing = await prisma.question.findMany({
        where: { id: { in: questionIds } },
        select: { id: true },
      })

      const existingIds = new Set(existing.map((q) => q.id))

      const idToCategory: Record<string, string> = {}
      med.forEach((r: any) => (idToCategory[r.questionId] = "medical"))
      fam.forEach((r: any) => (idToCategory[r.questionId] = "family"))
      feat.forEach((r: any) => (idToCategory[r.questionId] = "features"))

      const toCreate = questionIds
        .filter((qid) => !existingIds.has(qid))
        .map((qid) => ({
          id: qid,
          category: idToCategory[qid] || "medical",
          text: qid.replace(/[_-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          type: "choice",
        }))

      if (toCreate.length > 0) {
        await prisma.question.createMany({ data: toCreate, skipDuplicates: true })
      }

      const responses = allResponses.map((response: any) => ({
        patientId: id,
        questionId: response.questionId,
        answer: response.answer,
      }))

      await prisma.response.createMany({ data: responses })
    }

    return NextResponse.json({
      success: true,
      message: "Patient updated successfully",
    })
  } catch (error) {
    console.error("Failed to update patient:", error)
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    })

    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Delete patient (cascade will delete related records)
    await prisma.patient.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Patient deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete patient:", error)
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    )
  }
}
