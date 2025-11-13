"use client"

import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

type Props = {
  searchParams?: { id?: string }
}

export default async function ResultPage({ searchParams }: Props) {
  const patientId = searchParams?.id

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 max-w-md mx-4">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="text-destructive/80">No patient ID provided</p>
        </div>
      </div>
    )
  }

  // Fetch latest diagnosis for the patient
  const diagnosis = await prisma.diagnosis.findFirst({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  })

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 max-w-md mx-4">
          <h2 className="text-xl font-semibold text-destructive mb-2">No Results</h2>
          <p className="text-destructive/80">No analysis found for this patient.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-card dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-border">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
            Analysis Results
          </h1>

          <div className="space-y-8">
            <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-6 border-2 border-emerald-200 dark:border-emerald-800">
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-4">Diagnosis</h3>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{diagnosis.result}</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">Confidence Score</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    style={{ width: `${(diagnosis.confidence || 0) * 100}%` }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                  />
                </div>
                <span className="text-blue-700 dark:text-blue-300 font-semibold">{((diagnosis.confidence || 0) * 100).toFixed(1)}%</span>
              </div>
            </div>

            {diagnosis.metadata && (
              <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-6 border-2 border-violet-200 dark:border-violet-800">
                <h3 className="text-xl font-bold text-violet-700 dark:text-violet-300 mb-4">Additional Information</h3>
                <pre className="text-sm bg-white dark:bg-gray-800 p-4 rounded mt-2 overflow-x-auto">{JSON.stringify(diagnosis.metadata, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}