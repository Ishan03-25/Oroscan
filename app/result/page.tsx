"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PatientFormResponse } from "@/types/form"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function ResultPage() {
  const searchParams = useSearchParams()
  const patientId = searchParams.get("id")
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<PatientFormResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results?patientId=${patientId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch results")
        }
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error("Error fetching results:", error)
        setError("Failed to load results. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (patientId) {
      fetchResults()
    } else {
      setError("No patient ID provided")
      setIsLoading(false)
    }
  }, [patientId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground">
            Analyzing Results...
          </h2>
          <p className="text-muted-foreground mt-2">
            Please wait while we process your data
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 max-w-md mx-4">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="bg-card dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-border">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
            Analysis Results
          </h1>

          <div className="space-y-8">
            <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-6 border-2 border-emerald-200 dark:border-emerald-800">
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-4">
                Diagnosis
              </h3>
              <p className="text-gray-800 dark:text-gray-200 text-lg">
                {result?.diagnosis.result}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">
                Confidence Score
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(result?.diagnosis.confidence || 0) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                  />
                </div>
                <span className="text-blue-700 dark:text-blue-300 font-semibold">
                  {((result?.diagnosis.confidence || 0) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {result?.diagnosis.metadata && (
              <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-6 border-2 border-violet-200 dark:border-violet-800">
                <h3 className="text-xl font-bold text-violet-700 dark:text-violet-300 mb-4">
                  Additional Information
                </h3>
                <pre className="text-sm bg-white dark:bg-gray-800 p-4 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(result.diagnosis.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}