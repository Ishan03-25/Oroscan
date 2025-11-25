"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface PatientFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  mode: "create" | "edit"
}

const medicalQuestions = [
  { id: "diabetes", label: "Diabetes", type: "yesno" },
  { id: "tobacco_use", label: "Tobacco Use", type: "yesno" },
  { id: "alcohol_use", label: "Alcohol Use", type: "yesno" },
  { id: "previous_oral_conditions", label: "Previous Oral Conditions", type: "yesno" },
]

const familyQuestions = [
  { id: "family_cancer_history", label: "Family Cancer History", type: "yesno" },
  { id: "genetic_conditions", label: "Genetic Conditions", type: "yesno" },
]

const featureQuestions = [
  { id: "mouth_ulcers", label: "Mouth Ulcers", type: "yesno" },
  { id: "white_patches", label: "White Patches", type: "yesno" },
  { id: "red_patches", label: "Red Patches", type: "yesno" },
  { id: "difficulty_swallowing", label: "Difficulty Swallowing", type: "yesno" },
  { id: "persistent_sore_throat", label: "Persistent Sore Throat", type: "yesno" },
  { id: "bleeding_gums", label: "Bleeding Gums", type: "yesno" },
]

export default function PatientFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    age: initialData?.age || "",
    gender: initialData?.gender || "male",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    healthAssistant: initialData?.healthAssistant || "",
    medicalAnswers: initialData?.medicalAnswers || {},
    familyAnswers: initialData?.familyAnswers || {},
    featureAnswers: initialData?.featureAnswers || {},
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const submitData = {
        ...formData,
        medicalResponses: Object.entries(formData.medicalAnswers).map(([id, answer]) => ({
          questionId: id,
          answer,
        })),
        familyResponses: Object.entries(formData.familyAnswers).map(([id, answer]) => ({
          questionId: id,
          answer,
        })),
        featureResponses: Object.entries(formData.featureAnswers).map(([id, answer]) => ({
          questionId: id,
          answer,
        })),
      }

      await onSubmit(submitData)
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to submit form")
    } finally {
      setSubmitting(false)
    }
  }

  const updateMedicalAnswer = (questionId: string, answer: string) => {
    setFormData({
      ...formData,
      medicalAnswers: { ...formData.medicalAnswers, [questionId]: answer },
    })
  }

  const updateFamilyAnswer = (questionId: string, answer: string) => {
    setFormData({
      ...formData,
      familyAnswers: { ...formData.familyAnswers, [questionId]: answer },
    })
  }

  const updateFeatureAnswer = (questionId: string, answer: string) => {
    setFormData({
      ...formData,
      featureAnswers: { ...formData.featureAnswers, [questionId]: answer },
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 sm:mt-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {mode === "create" ? "Add New Patient" : "Edit Patient"}
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Patient Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="150"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        required
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Health Assistant
                      </label>
                      <input
                        type="text"
                        value={formData.healthAssistant}
                        onChange={(e) => setFormData({ ...formData, healthAssistant: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Medical History</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicalQuestions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {q.label}
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`medical_${q.id}`}
                              value="yes"
                              checked={formData.medicalAnswers[q.id] === "yes"}
                              onChange={(e) => updateMedicalAnswer(q.id, e.target.value)}
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`medical_${q.id}`}
                              value="no"
                              checked={formData.medicalAnswers[q.id] === "no"}
                              onChange={(e) => updateMedicalAnswer(q.id, e.target.value)}
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Family History */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Family History</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {familyQuestions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {q.label}
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`family_${q.id}`}
                              value="yes"
                              checked={formData.familyAnswers[q.id] === "yes"}
                              onChange={(e) => updateFamilyAnswer(q.id, e.target.value)}
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`family_${q.id}`}
                              value="no"
                              checked={formData.familyAnswers[q.id] === "no"}
                              onChange={(e) => updateFamilyAnswer(q.id, e.target.value)}
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features/Symptoms */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Symptoms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureQuestions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {q.label}
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`feature_${q.id}`}
                              value="yes"
                              checked={formData.featureAnswers[q.id] === "yes"}
                              onChange={(e) => updateFeatureAnswer(q.id, e.target.value)}
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`feature_${q.id}`}
                              value="no"
                              checked={formData.featureAnswers[q.id] === "no"}
                              onChange={(e) => updateFeatureAnswer(q.id, e.target.value)}
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {submitting ? "Saving..." : mode === "create" ? "Create Patient" : "Update Patient"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
