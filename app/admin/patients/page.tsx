"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Filter, Download, ChevronDown, UserPlus, Edit2, Trash2 } from "lucide-react"
import * as XLSX from "xlsx"
import PatientFormModal from "@/components/admin/patient-form-modal"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  address: string
  healthAssistant: string | null
  createdAt: string
  diagnosis: {
    result: string
    confidence: number
  } | null
  responses: Array<{
    questionId: string
    answer: string
    createdAt: string
    updatedAt: string
  }>
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGender, setFilterGender] = useState("all")
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/admin/patients")
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients || [])
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePatient = async (data: any) => {
    const response = await fetch("/api/admin/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create patient")
    }

    await fetchPatients()
  }

  const handleEditPatient = async (patient: Patient) => {
    // Fetch full patient details including responses
    const response = await fetch(`/api/admin/patients/${patient.id}`)
    if (response.ok) {
      const data = await response.json()
      const fullPatient = data.patient
      
      // Organize responses by category
      const medicalAnswers: Record<string, string> = {}
      const familyAnswers: Record<string, string> = {}
      const featureAnswers: Record<string, string> = {}

      fullPatient.responses.forEach((r: any) => {
        const category = r.question?.category || "medical"
        if (category === "medical") {
          medicalAnswers[r.questionId] = r.answer
        } else if (category === "family") {
          familyAnswers[r.questionId] = r.answer
        } else if (category === "features") {
          featureAnswers[r.questionId] = r.answer
        }
      })

      setSelectedPatient({
        ...fullPatient,
        medicalAnswers,
        familyAnswers,
        featureAnswers,
      })
      setShowEditModal(true)
      setError("")
    }
  }

  const handleUpdatePatient = async (data: any) => {
    if (!selectedPatient) return

    const response = await fetch(`/api/admin/patients/${selectedPatient.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update patient")
    }

    await fetchPatients()
    setShowEditModal(false)
    setSelectedPatient(null)
  }

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowDeleteModal(true)
    setError("")
  }

  const confirmDeletePatient = async () => {
    if (!selectedPatient) return

    setDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/patients/${selectedPatient.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPatients()
        setShowDeleteModal(false)
        setSelectedPatient(null)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete patient")
      }
    } catch (error) {
      console.error("Failed to delete patient:", error)
      setError("Failed to delete patient")
    } finally {
      setDeleting(false)
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm)
    const matchesGender = filterGender === "all" || patient.gender === filterGender
    return matchesSearch && matchesGender
  })

  const exportToJSON = () => {
    const dataToExport = filteredPatients.map(patient => ({
      ID: patient.id,
      Name: patient.name,
      Age: patient.age,
      Gender: patient.gender,
      Phone: patient.phone,
      Address: patient.address,
      HealthAssistant: patient.healthAssistant || "N/A",
      Diagnosis: patient.diagnosis?.result || "Pending",
      Confidence: patient.diagnosis?.confidence ? `${(patient.diagnosis.confidence * 100).toFixed(1)}%` : "N/A",
      RegistrationDate: new Date(patient.createdAt).toLocaleDateString(),
      TotalResponses: patient.responses.length,
      Responses: patient.responses.map(r => ({
        QuestionID: r.questionId,
        Answer: r.answer,
        AnsweredAt: new Date(r.createdAt).toLocaleString()
      }))
    }))

    const jsonString = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `patients_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const exportToCSV = () => {
    // Create comprehensive CSV with patient details and responses
    const headers = ["Patient ID", "Name", "Age", "Gender", "Phone", "Address", "Health Assistant", "Question ID", "Answer", "Diagnosis", "Confidence", "Registration Date", "Response Date"]
    const rows: string[][] = []
    
    filteredPatients.forEach(patient => {
      if (patient.responses.length > 0) {
        // Create a row for each response
        patient.responses.forEach(response => {
          rows.push([
            patient.id,
            patient.name,
            patient.age.toString(),
            patient.gender,
            patient.phone,
            patient.address,
            patient.healthAssistant || "N/A",
            response.questionId,
            response.answer,
            patient.diagnosis?.result || "Pending",
            patient.diagnosis?.confidence ? `${(patient.diagnosis.confidence * 100).toFixed(1)}%` : "N/A",
            new Date(patient.createdAt).toLocaleDateString(),
            new Date(response.createdAt).toLocaleDateString()
          ])
        })
      } else {
        // If no responses, create one row with patient info
        rows.push([
          patient.id,
          patient.name,
          patient.age.toString(),
          patient.gender,
          patient.phone,
          patient.address,
          patient.healthAssistant || "N/A",
          "N/A",
          "No responses",
          patient.diagnosis?.result || "Pending",
          patient.diagnosis?.confidence ? `${(patient.diagnosis.confidence * 100).toFixed(1)}%` : "N/A",
          new Date(patient.createdAt).toLocaleDateString(),
          "N/A"
        ])
      }
    })

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `patients_complete_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const exportToExcel = () => {
    // Main patients sheet with comprehensive info
    const dataToExport = filteredPatients.map(patient => ({
      "Patient ID": patient.id,
      "Name": patient.name,
      "Age": patient.age,
      "Gender": patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1),
      "Phone": patient.phone,
      "Address": patient.address,
      "Health Assistant": patient.healthAssistant || "N/A",
      "Total Responses": patient.responses.length,
      "Diagnosis": patient.diagnosis?.result || "Pending",
      "Confidence": patient.diagnosis?.confidence ? `${(patient.diagnosis.confidence * 100).toFixed(1)}%` : "N/A",
      "Registration Date": new Date(patient.createdAt).toLocaleDateString()
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients Summary")

    // Set column widths for patients sheet
    worksheet["!cols"] = [
      { wch: 30 }, // Patient ID
      { wch: 20 }, // Name
      { wch: 10 }, // Age
      { wch: 10 }, // Gender
      { wch: 15 }, // Phone
      { wch: 30 }, // Address
      { wch: 20 }, // Health Assistant
      { wch: 15 }, // Total Responses
      { wch: 15 }, // Diagnosis
      { wch: 12 }, // Confidence
      { wch: 18 }  // Date
    ]

    // Detailed responses sheet with health assistant info
    const responsesData: any[] = []
    filteredPatients.forEach(patient => {
      patient.responses.forEach(response => {
        responsesData.push({
          "Patient ID": patient.id,
          "Patient Name": patient.name,
          "Age": patient.age,
          "Gender": patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1),
          "Phone": patient.phone,
          "Health Assistant": patient.healthAssistant || "N/A",
          "Question ID": response.questionId,
          "Answer": response.answer,
          "Answered At": new Date(response.createdAt).toLocaleString()
        })
      })
    })

    if (responsesData.length > 0) {
      const responsesSheet = XLSX.utils.json_to_sheet(responsesData)
      XLSX.utils.book_append_sheet(workbook, responsesSheet, "Detailed Responses")
      responsesSheet["!cols"] = [
        { wch: 12 }, // Patient ID
        { wch: 20 }, // Patient Name
        { wch: 8 },  // Age
        { wch: 10 }, // Gender
        { wch: 15 }, // Phone
        { wch: 20 }, // Health Assistant
        { wch: 25 }, // Question ID
        { wch: 40 }, // Answer
        { wch: 20 }  // Answered At
      ]
    }

    XLSX.writeFile(workbook, `patients_complete_${new Date().toISOString().split('T')[0]}.xlsx`)
    setShowExportMenu(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading patients...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total: {filteredPatients.length} patients
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Patient
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={exportToJSON}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Export as Excel (.xlsx)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{patient.age}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 capitalize">{patient.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.diagnosis ? (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.diagnosis.result === "positive" 
                            ? "bg-red-100 text-red-800"
                            : patient.diagnosis.result === "negative"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {patient.diagnosis.result}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/patients/${patient.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit patient"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Patient Modal */}
      <PatientFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePatient}
        mode="create"
      />

      {/* Edit Patient Modal */}
      {selectedPatient && (
        <PatientFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedPatient(null)
          }}
          onSubmit={handleUpdatePatient}
          initialData={selectedPatient}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowDeleteModal(false)}
            />

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Delete Patient
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete patient <span className="font-semibold">{selectedPatient.name}</span> (ID: {selectedPatient.id})? 
                      This action cannot be undone and will delete all associated records.
                    </p>
                  </div>
                  {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={confirmDeletePatient}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-400"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
