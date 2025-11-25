"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"

interface PatientDetails {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  address: string
  healthAssistant: string | null
  createdAt: string
  responses: Array<{
    id: string
    answer: string
    question: {
      id: string
      text: string
      category: string
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
    metadata: any
    createdAt: string
  }>
}

export default function PatientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<PatientDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPatientDetails(params.id as string)
    }
  }, [params.id])

  const fetchPatientDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/patients/${id}`)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading patient details...</div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient not found</p>
        <Link href="/patients" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to Patients
        </Link>
      </div>
    )
  }

  const medicalResponses = patient.responses.filter(r => r.question.category === "medical")
  const familyResponses = patient.responses.filter(r => r.question.category === "family")
  const featureResponses = patient.responses.filter(r => r.question.category === "features")
  const latestDiagnosis = patient.diagnoses[0]

  const handleDownloadReport = () => {
    const reportContent = generateReportHTML(patient, medicalResponses, familyResponses, featureResponses, latestDiagnosis)
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(reportContent)
      printWindow.document.close()
      
      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
      }, 500)
    }
  }

  const generateReportHTML = (
    patient: PatientDetails,
    medical: typeof medicalResponses,
    family: typeof familyResponses,
    features: typeof featureResponses,
    diagnosis: typeof latestDiagnosis
  ) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Patient Report - ${patient.name}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
          }
          .header h1 {
            color: #2563eb;
            font-size: 28px;
            margin-bottom: 5px;
          }
          .header p {
            color: #666;
            font-size: 14px;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            background-color: #f3f4f6;
            padding: 10px 15px;
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            border-left: 4px solid #2563eb;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-item {
            padding: 10px;
            background-color: #f9fafb;
            border-radius: 4px;
          }
          .info-label {
            font-weight: bold;
            color: #4b5563;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 3px;
          }
          .info-value {
            color: #1f2937;
            font-size: 15px;
          }
          .response-item {
            padding: 12px;
            margin-bottom: 10px;
            background-color: #f9fafb;
            border-radius: 4px;
            border-left: 3px solid #e5e7eb;
          }
          .response-question {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
          }
          .response-answer {
            color: #1f2937;
            padding-left: 15px;
          }
          .diagnosis-box {
            padding: 20px;
            background-color: #fef3c7;
            border-radius: 8px;
            border: 2px solid #fbbf24;
            margin-top: 10px;
          }
          .diagnosis-box.positive {
            background-color: #fee2e2;
            border-color: #dc2626;
          }
          .diagnosis-box.negative {
            background-color: #dcfce7;
            border-color: #16a34a;
          }
          .diagnosis-result {
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .diagnosis-result.positive {
            color: #dc2626;
          }
          .diagnosis-result.negative {
            color: #16a34a;
          }
          .diagnosis-result.uncertain {
            color: #ca8a04;
          }
          .confidence {
            font-size: 14px;
            color: #4b5563;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          @media print {
            body {
              padding: 20px;
            }
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>OROSCAN</h1>
          <p>Oral Cancer Screening Report</p>
          <p>Generated on ${currentDate}</p>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Patient Name</div>
              <div class="info-value">${patient.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Patient ID</div>
              <div class="info-value">${patient.id}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Age</div>
              <div class="info-value">${patient.age} years</div>
            </div>
            <div class="info-item">
              <div class="info-label">Gender</div>
              <div class="info-value">${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Phone</div>
              <div class="info-value">${patient.phone}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Address</div>
              <div class="info-value">${patient.address}</div>
            </div>
            ${patient.healthAssistant ? `
            <div class="info-item">
              <div class="info-label">Health Assistant</div>
              <div class="info-value">${patient.healthAssistant}</div>
            </div>
            ` : ''}
            <div class="info-item">
              <div class="info-label">Registration Date</div>
              <div class="info-value">${new Date(patient.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        ${medical.length > 0 ? `
        <div class="section">
          <div class="section-title">Medical History</div>
          ${medical.map(response => `
            <div class="response-item">
              <div class="response-question">${response.question.text}</div>
              <div class="response-answer">${response.answer}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${family.length > 0 ? `
        <div class="section">
          <div class="section-title">Family History</div>
          ${family.map(response => `
            <div class="response-item">
              <div class="response-question">${response.question.text}</div>
              <div class="response-answer">${response.answer}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${features.length > 0 ? `
        <div class="section">
          <div class="section-title">Clinical Features & Symptoms</div>
          ${features.map(response => `
            <div class="response-item">
              <div class="response-question">${response.question.text}</div>
              <div class="response-answer">${response.answer}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${diagnosis ? `
        <div class="section">
          <div class="section-title">Diagnosis Result</div>
          <div class="diagnosis-box ${diagnosis.result.toLowerCase()}">
            <div class="diagnosis-result ${diagnosis.result.toLowerCase()}">${diagnosis.result}</div>
            <div class="confidence">Confidence Level: ${(diagnosis.confidence * 100).toFixed(1)}%</div>
            <div style="margin-top: 10px; font-size: 13px; color: #4b5563;">
              Date: ${new Date(diagnosis.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        ` : `
        <div class="section">
          <div class="section-title">Diagnosis Result</div>
          <div class="diagnosis-box">
            <div class="diagnosis-result uncertain">Pending Diagnosis</div>
            <div style="margin-top: 10px; font-size: 13px; color: #4b5563;">
              Diagnosis has not been completed yet.
            </div>
          </div>
        </div>
        `}

        <div class="footer">
          <p><strong>OROSCAN - Oral Cancer Screening System</strong></p>
          <p>This report is computer-generated and should be reviewed by a qualified healthcare professional.</p>
          <p>For any queries, please contact your healthcare provider.</p>
        </div>
      </body>
      </html>
    `
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
          </div>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="text-base font-medium text-gray-900">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-base font-medium text-gray-900 capitalize">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base font-medium text-gray-900">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="text-base font-medium text-gray-900">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-base font-medium text-gray-900">{patient.address}</p>
              </div>
              {patient.healthAssistant && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Health Assistant</p>
                  <p className="text-base font-medium text-gray-900">{patient.healthAssistant}</p>
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          {latestDiagnosis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Result</span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    latestDiagnosis.result === "positive"
                      ? "bg-red-100 text-red-800"
                      : latestDiagnosis.result === "negative"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {latestDiagnosis.result}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Confidence</span>
                  <span className="text-base font-medium text-gray-900">
                    {(latestDiagnosis.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-base font-medium text-gray-900">
                    {new Date(latestDiagnosis.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Medical History */}
          {medicalResponses.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h2>
              <div className="space-y-3">
                {medicalResponses.map((response) => (
                  <div key={response.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{response.question.text}</span>
                    <span className="text-sm font-medium text-gray-900">{response.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Family History */}
          {familyResponses.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Family History</h2>
              <div className="space-y-3">
                {familyResponses.map((response) => (
                  <div key={response.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{response.question.text}</span>
                    <span className="text-sm font-medium text-gray-900">{response.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features/Symptoms */}
          {featureResponses.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Symptoms & Features</h2>
              <div className="space-y-3">
                {featureResponses.map((response) => (
                  <div key={response.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{response.question.text}</span>
                    <span className="text-sm font-medium text-gray-900">{response.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="space-y-6">
          {patient.images.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Images</h2>
              <div className="space-y-4">
                {patient.images.map((image) => (
                  <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative w-full h-48 bg-gray-100">
                      <Image
                        src={image.url}
                        alt={image.type}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-700 capitalize">{image.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
