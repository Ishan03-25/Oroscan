"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Filter, Download, ChevronDown } from "lucide-react"
import * as XLSX from "xlsx"

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
    const headers = ["ID", "Name", "Age", "Gender", "Phone", "Address", "Health Assistant", "Total Responses", "Diagnosis", "Confidence", "Registration Date"]
    const rows = filteredPatients.map(patient => [
      patient.id,
      patient.name,
      patient.age,
      patient.gender,
      patient.phone,
      patient.address,
      patient.healthAssistant || "N/A",
      patient.responses.length,
      patient.diagnosis?.result || "Pending",
      patient.diagnosis?.confidence ? `${(patient.diagnosis.confidence * 100).toFixed(1)}%` : "N/A",
      new Date(patient.createdAt).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `patients_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const exportToExcel = () => {
    // Main patients sheet
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients")

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

    // Responses sheet
    const responsesData: any[] = []
    filteredPatients.forEach(patient => {
      patient.responses.forEach(response => {
        responsesData.push({
          "Patient ID": patient.id,
          "Patient Name": patient.name,
          "Question ID": response.questionId,
          "Answer": response.answer,
          "Answered At": new Date(response.createdAt).toLocaleString()
        })
      })
    })

    if (responsesData.length > 0) {
      const responsesSheet = XLSX.utils.json_to_sheet(responsesData)
      XLSX.utils.book_append_sheet(workbook, responsesSheet, "Responses")
      responsesSheet["!cols"] = [
        { wch: 30 }, // Patient ID
        { wch: 20 }, // Patient Name
        { wch: 20 }, // Question ID
        { wch: 40 }, // Answer
        { wch: 20 }  // Answered At
      ]
    }

    XLSX.writeFile(workbook, `patients_${new Date().toISOString().split('T')[0]}.xlsx`)
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
                      <Link
                        href={`/admin/patients/${patient.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
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
    </div>
  )
}
