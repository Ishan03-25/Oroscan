"use client"

import { useEffect, useState } from "react"
import { X, User, Phone, MapPin, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PatientDetailsDialogProps {
  patientId: string
  isOpen: boolean
  onClose: () => void
}

interface PatientDetails {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  address: string
  healthAssistant: string | null
  createdBy: string | null
  createdAt: string
  responses: Array<{
    id: string
    answer: string
    question: {
      id: string
      text: string
      category: string
      type: string
    }
  }>
  images: Array<{
    id: string
    url: string
    type: string
    createdAt: string
  }>
  diagnoses: Array<{
    id: string
    result: string
    confidence: number
    createdAt: string
  }>
}

export default function PatientDetailsDialog({ patientId, isOpen, onClose }: PatientDetailsDialogProps) {
  const [patient, setPatient] = useState<PatientDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetails()
    }
  }, [isOpen, patientId])

  const fetchPatientDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/patients/${patientId}`)
      if (response.ok) {
        const data = await response.json()
        setPatient(data.patient)
      }
    } catch (error) {
      console.error("Failed to fetch patient details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const medicalResponses = patient?.responses.filter(r => r.question.category === "medical") || []
  const familyResponses = patient?.responses.filter(r => r.question.category === "family") || []
  const featureResponses = patient?.responses.filter(r => r.question.category === "features") || []
  const latestDiagnosis = patient?.diagnoses[0]

  // Image mapping for each question type
  const imageMapping: Record<string, Record<string, { url: string; label: string }>> = {
    'asymmetry': {
      '1': { url: '/mouth/assymetry.png', label: 'Asymmetry' }
    },
    'patches': {
      '1': { url: '/mouth/patch-1.png', label: 'Red Patch' },
      '2': { url: '/mouth/patch-2.png', label: 'White Patch' },
      '3': { url: '/mouth/patch-3.png', label: 'Red & White Patch' },
      '4': { url: '/mouth/patch-4.png', label: 'Patch Type 4' },
      '5': { url: '/mouth/patch-5.png', label: 'Patch Type 5' },
      '6': { url: '/mouth/patch-6.png', label: 'Patch Type 6' },
      '7': { url: '/mouth/patch-7.png', label: 'Patch Type 7' },
      '8': { url: '/mouth/patch-8.png', label: 'Patch Type 8' },
      '9': { url: '/mouth/patch-9.png', label: 'Patch Type 9' },
      '10': { url: '/mouth/patch-10.png', label: 'Patch Type 10' },
      '11': { url: '/mouth/patch-11.png', label: 'Patch Type 11' },
      '12': { url: '/mouth/patch-12.png', label: 'Patch Type 12' },
      '13': { url: '/mouth/patch-13.png', label: 'Patch Type 13' }
    },
    'lumps': {
      '1': { url: '/mouth/lumps-1.png', label: 'Lump Type 1' },
      '2': { url: '/mouth/lumps-2.png', label: 'Lump Type 2' },
      '3': { url: '/mouth/lumps-3.png', label: 'Lump Type 3' },
      '4': { url: '/mouth/lumps-4.png', label: 'Lump Type 4' }
    },
    'trismus': {
      '1': { url: '/mouth/trismus.png', label: 'Trismus' }
    }
  }

  // Helper function to get images based on question ID and answer
  const getImagesForQuestion = (questionId: string, answer: string) => {
    // Determine the question type from question ID
    const questionType = questionId.toLowerCase()
    let imageType = ''
    
    if (questionType.includes('asymmetry')) {
      imageType = 'asymmetry'
    } else if (questionType.includes('patch')) {
      imageType = 'patches'
    } else if (questionType.includes('lump')) {
      imageType = 'lumps'
    } else if (questionType.includes('trismus')) {
      imageType = 'trismus'
    }
    
    if (!imageType || !imageMapping[imageType]) {
      return []
    }
    
    // Parse answer to get selected image IDs
    let selectedIds: string[] = []
    try {
      const parsed = JSON.parse(answer)
      if (Array.isArray(parsed)) {
        selectedIds = parsed.map(id => String(id))
      } else {
        selectedIds = [String(parsed)]
      }
    } catch (e) {
      // If not JSON, treat as comma-separated or single value
      selectedIds = answer.split(',').map(id => id.trim())
    }
    
    // Map IDs to images
    return selectedIds
      .map(id => imageMapping[imageType][id])
      .filter(img => img !== undefined)
  }

  // Helper function to render response with images if applicable
  const renderResponse = (response: any) => {
    const images = getImagesForQuestion(response.question.id, response.answer)
    const isImageQuestion = response.question.type === "image-select" || images.length > 0
    
    return (
      <div key={response.id} className="border-b border-slate-200 dark:border-slate-700 pb-3 last:border-0">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{response.question.text}</p>
        
        {isImageQuestion && images.length > 0 ? (
          <div className="mt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Selected Images:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                    {img.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{response.answer}</p>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Patient Details</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-500">Loading patient details...</div>
            </div>
          ) : !patient ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-500">Patient not found</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Patient ID</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{patient.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{patient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Age</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gender</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Registration Date
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Address
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{patient.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Health Assistant</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{patient.healthAssistant || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Created By</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{patient.createdBy || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              {latestDiagnosis && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Diagnosis
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Result</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">{latestDiagnosis.result}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Confidence</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {(latestDiagnosis.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Date</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {new Date(latestDiagnosis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical History Responses */}
              {medicalResponses.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Medical History
                  </h3>
                  <div className="space-y-4">
                    {medicalResponses.map((response) => renderResponse(response))}
                  </div>
                </div>
              )}

              {/* Family History Responses */}
              {familyResponses.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Family History
                  </h3>
                  <div className="space-y-4">
                    {familyResponses.map((response) => renderResponse(response))}
                  </div>
                </div>
              )}

              {/* Feature Responses */}
              {featureResponses.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Clinical Features
                  </h3>
                  <div className="space-y-4">
                    {featureResponses.map((response) => renderResponse(response))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
