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

    const totalPatients = await prisma.patient.count()
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayPatients = await prisma.patient.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    })

    const totalDiagnoses = await prisma.diagnosis.count()

    const avgConfidenceResult = await prisma.diagnosis.aggregate({
      _avg: {
        confidence: true,
      },
    })

    const recentPatients = await prisma.patient.findMany({
      take: 10,
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
      },
    })

    const formattedPatients = recentPatients.map((patient) => ({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      diagnosis: patient.diagnoses[0]?.result || "pending",
      confidence: patient.diagnoses[0]?.confidence || 0,
      createdAt: patient.createdAt.toISOString(),
    }))

    return NextResponse.json({
      totalPatients,
      todayPatients,
      totalDiagnoses,
      avgConfidence: avgConfidenceResult._avg.confidence || 0,
      recentPatients: formattedPatients,
    })
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
