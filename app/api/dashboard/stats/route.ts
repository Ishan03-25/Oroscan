import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const username = session.user.username

    // Fetch user to get the exact username
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Build filter based on role
    let patientFilter: any = {}
    
    // Filter by who created the screening
    // HEALTH_ASSISTANT: only their own screenings
    // DOCTOR/ADMIN: all screenings
    if (user.role === 'HEALTH_ASSISTANT') {
      patientFilter = {
        createdBy: username
      }
    }

    // Get total patients
    const totalPatients = await prisma.patient.count({
      where: patientFilter
    })

    // Get today's patients
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayPatients = await prisma.patient.count({
      where: {
        ...patientFilter,
        createdAt: {
          gte: todayStart
        }
      }
    })

    // Get patients with diagnoses
    const patientsWithDiagnoses = await prisma.patient.findMany({
      where: patientFilter,
      include: {
        diagnoses: true
      }
    })

    const totalDiagnoses = patientsWithDiagnoses.filter(p => p.diagnoses.length > 0).length
    
    // Calculate average confidence
    let totalConfidence = 0
    let diagnosisCount = 0
    patientsWithDiagnoses.forEach(patient => {
      if (patient.diagnoses.length > 0) {
        const latestDiagnosis = patient.diagnoses[patient.diagnoses.length - 1]
        totalConfidence += latestDiagnosis.confidence
        diagnosisCount++
      }
    })
    const avgConfidence = diagnosisCount > 0 ? totalConfidence / diagnosisCount : 0

    // Get recent patients (last 10)
    const recentPatients = await prisma.patient.findMany({
      where: patientFilter,
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        diagnoses: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    })

    const formattedRecentPatients = recentPatients.map((patient: any) => ({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      healthAssistant: patient.healthAssistant,
      createdBy: patient.createdBy,
      diagnosis: patient.diagnoses[0]?.result || "Pending",
      confidence: patient.diagnoses[0]?.confidence || 0,
      status: patient.diagnoses.length > 0 ? "Completed" : "Pending",
      createdAt: patient.createdAt.toISOString(),
    }))

    return NextResponse.json({
      totalPatients,
      todayPatients,
      totalDiagnoses,
      avgConfidence,
      recentPatients: formattedRecentPatients,
      userRole: user.role,
      username: user.username,
    })
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
