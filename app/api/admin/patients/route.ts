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

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const {
      name,
      age,
      gender,
      phone,
      address,
      healthAssistant,
      assignedToUsername,
      medicalResponses,
      familyResponses,
      featureResponses,
    } = data

    // Validate required fields
    if (!name || !age || !gender || !phone) {
      return NextResponse.json(
        { error: "Name, age, gender, and phone are required" },
        { status: 400 }
      )
    }

    // Validate assignedToUsername is required and is a health assistant
    if (!assignedToUsername) {
      return NextResponse.json(
        { error: "Assigned Health Assistant username is required" },
        { status: 400 }
      )
    }

    // Verify the assigned user exists and is a health assistant
    const assignedUser = await prisma.user.findUnique({
      where: { username: assignedToUsername },
      select: { id: true, username: true, role: true },
    })

    if (!assignedUser) {
      return NextResponse.json(
        { error: "Assigned user not found" },
        { status: 404 }
      )
    }

    if (assignedUser.role !== "HEALTH_ASSISTANT") {
      return NextResponse.json(
        { error: "Assigned user must be a Health Assistant" },
        { status: 400 }
      )
    }

    // Generate unique 5-digit patient ID
    let patientId: string
    let isUnique = false
    
    while (!isUnique) {
      patientId = Math.floor(10000 + Math.random() * 90000).toString()
      const existing = await prisma.patient.findUnique({
        where: { id: patientId },
      })
      if (!existing) {
        isUnique = true
      }
    }

    // Create patient with assigned user as both doctor and createdBy
    const patient = await prisma.patient.create({
      data: {
        id: patientId!,
        name,
        age: parseInt(age),
        gender,
        phone,
        address: address || "",
        healthAssistant: healthAssistant || null,
        createdBy: assignedUser.username,
        doctorId: assignedUser.id,
      },
    })

    // Prepare and store responses
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
        patientId: patient.id,
        questionId: response.questionId,
        answer: response.answer,
      }))

      await prisma.response.createMany({ data: responses })
    }

    return NextResponse.json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
        healthAssistant: patient.healthAssistant,
        createdAt: patient.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Failed to create patient:", error)
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    )
  }
}
