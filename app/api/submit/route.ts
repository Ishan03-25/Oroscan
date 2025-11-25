import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { s3Client, BUCKET_NAME } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const {
      patientId,
      patientInfo,
      medicalResponses,
      familyResponses,
      featureResponses,
    } = data

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    // Check if patient exists and user has permission
    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    })

    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Health assistants can only edit screenings they created
    if (user.role === 'HEALTH_ASSISTANT' && existingPatient.createdBy !== user.username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update patient record
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        name: patientInfo.name,
        age: parseInt(patientInfo.age),
        gender: patientInfo.gender,
        phone: patientInfo.phone,
        healthAssistant: patientInfo.healthAssistant,
        address: patientInfo.address,
      },
    })

    // Delete existing responses
    await prisma.response.deleteMany({
      where: { patientId },
    })

    // Prepare and store new responses
    const med = Array.isArray(medicalResponses) ? medicalResponses : []
    const fam = Array.isArray(familyResponses) ? familyResponses : []
    const feat = Array.isArray(featureResponses) ? featureResponses : []

    const allResponses = [...med, ...fam, ...feat]

    const questionIds = Array.from(new Set(allResponses.map((r: any) => r.questionId)))

    if (questionIds.length > 0) {
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
        .filter((id) => !existingIds.has(id))
        .map((id) => ({
          id,
          category: idToCategory[id] || "medical",
          text: id.replace(/[_-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          type: "choice",
        }))

      if (toCreate.length > 0) {
        await prisma.question.createMany({ data: toCreate, skipDuplicates: true })
      }
    }

    const responses = allResponses.map((response: any) => ({
      patientId,
      questionId: response.questionId,
      answer: response.answer,
    }))

    if (responses.length > 0) {
      await prisma.response.createMany({ data: responses })
    }

    return NextResponse.json({
      success: true,
      patientId,
      message: "Patient updated successfully",
    })
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const {
      patientInfo,
      medicalResponses,
      familyResponses,
      featureResponses,
      images,
    } = data

    // Generate a unique 5-digit patient ID
    let patientId: string
    let isUnique = false
    
    while (!isUnique) {
      // Generate random 5-digit number (10000-99999)
      patientId = String(Math.floor(10000 + Math.random() * 90000))
      
      // Check if ID already exists
      const existing = await prisma.patient.findUnique({
        where: { id: patientId }
      })
      
      if (!existing) {
        isUnique = true
      }
    }

    // Create patient record
    const patient = await prisma.patient.create({
      data: {
        id: patientId!,
        name: patientInfo.name,
        age: parseInt(patientInfo.age),
        gender: patientInfo.gender,
        phone: patientInfo.phone,
        healthAssistant: patientInfo.healthAssistant,
        address: patientInfo.address,
        createdBy: session.user.username, // Track who created this screening
        doctorId: session.user.id,
      },
    })

    // Prepare and store responses, ensuring corresponding Question records exist
    const med = Array.isArray(medicalResponses) ? medicalResponses : []
    const fam = Array.isArray(familyResponses) ? familyResponses : []
    const feat = Array.isArray(featureResponses) ? featureResponses : []

    const allResponses = [...med, ...fam, ...feat]

    const questionIds = Array.from(new Set(allResponses.map((r: any) => r.questionId)))

    if (questionIds.length > 0) {
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
        .filter((id) => !existingIds.has(id))
        .map((id) => ({
          id,
          category: idToCategory[id] || "medical",
          text: id.replace(/[_-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          type: "choice",
        }))

      if (toCreate.length > 0) {
        await prisma.question.createMany({ data: toCreate, skipDuplicates: true })
      }
    }

    const responses = allResponses.map((response: any) => ({
      patientId: patient.id,
      questionId: response.questionId,
      answer: response.answer,
    }))

    if (responses.length > 0) {
      await prisma.response.createMany({ data: responses })
    }

    // Handle image uploads (if any)
    // const imagePromises = Array.isArray(images)
    //   ? images.map(async (image: any) => {
    //       const key = `patients/${patient.id}/${Date.now()}-${image.name}`
    //       const command = new PutObjectCommand({
    //         Bucket: BUCKET_NAME,
    //         Key: key,
    //         Body: Buffer.from(image.data, "base64"),
    //         ContentType: image.type,
    //       })

    //       await s3Client.send(command)
    //       return prisma.image.create({
    //         data: {
    //           patientId: patient.id,
    //           url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
    //           type: image.category,
    //         },
    //       })
    //     })
    //   : []

    // const createdImages = imagePromises.length > 0 ? await Promise.all(imagePromises) : []

    // Call AI/ML API for analysis (if configured)
    // const aiPayload = {
    //   patientId: patient.id,
    //   responses,
    //   images: createdImages.map((img: any) => img.url),
    // }

    // let aiResult: any = { diagnosis: null, confidence: 0, metadata: null }

    // if (process.env.AI_API_ENDPOINT) {
    //   const aiResponse = await fetch(process.env.AI_API_ENDPOINT!, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(aiPayload),
    //   })

    //   aiResult = await aiResponse.json()
    // } else {
    //   aiResult = { diagnosis: "pending", confidence: 0, metadata: null }
    // }

    // Store AI/ML results
    // await prisma.diagnosis.create({
    //   data: {
    //     patientId: patient.id,
    //     result: aiResult.diagnosis,
    //     confidence: aiResult.confidence,
    //     metadata: aiResult.metadata,
    //   },
    // })

    return NextResponse.json({
      success: true,
      patientId: patient.id,
      // diagnosis: aiResult,
    })
  } catch (error) {
    console.error("Error processing submission:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}