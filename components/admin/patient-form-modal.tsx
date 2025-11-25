"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"

interface PatientFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  mode: "create" | "edit"
}

const medicalQuestions = [
  { id: "alcohol", label: "Alcohol intake?", type: "yesno" },
  { id: "tobacco", label: "Tobacco products (Cigarette / bidi / khaini / hookah)?", type: "yesno" },
  { id: "gutka", label: "Gutka (Areca Nut)?", type: "yesno" },
  { id: "paan", label: "Paan with slaked lime, zarda and betel nut?", type: "yesno" },
  { id: "precipitation", label: "Precipitation effect in the mouth due to tobacco or betel leaf?", type: "yesno" },
  { id: "hiv", label: "Have you ever been tested for HIV?", type: "yesno" },
  { id: "hpv", label: "Have you ever been tested for HPV?", type: "yesno" },
]

const familyQuestions = [
  { id: "family_cancer", label: "Family history of Head, Neck, Throat or oral cancer in blood relatives", type: "yesno" },
]

const featureQuestions = [
  { id: "asymmetry", label: "Abnormal Facial Asymmetry (Difference in shape/size on two sides of the face)?", type: "image", images: [{ id: "1", url: "/mouth/assymetry.png" }] },
  { id: "patches_image", label: "Red or White patches in the mouth (Choose the closest to what you see)?", type: "image", images: Array.from({ length: 13 }, (_, i) => ({ id: String(i + 1), url: `/mouth/patch-${i + 1}.png` })) },
  { id: "sore", label: "Sore or Ulcer in the mouth?", type: "yesno" },
  { id: "neck_lumps", label: "Is there any unexplained, painless, persistent lumps in the neck that do not go away?", type: "yesno" },
  { id: "lumps_mouth", label: "Lumps or thick spots in the mouth (Choose the closest to what you see)?", type: "image", images: Array.from({ length: 4 }, (_, i) => ({ id: String(i + 1), url: `/mouth/lumps-${i + 1}.png` })) },
  { id: "speech", label: "Is there any change in speech, such as a lisp?", type: "yesno" },
  { id: "chewing", label: "Is there any difficulty in chewing or swallowing?", type: "yesno" },
  { id: "oral_pain", label: "Is there any unexplained oral/facial pain or a perpetual sore throat?", type: "yesno" },
  { id: "trismus", label: "Please try the Trismus 3 finger test as shown in the image. Was the test painful?", type: "image", images: [{ id: "1", url: "/mouth/trismus.png" }] },
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
    assignedToUsername: initialData?.assignedToUsername || "",
    medicalAnswers: initialData?.medicalAnswers || {},
    familyAnswers: initialData?.familyAnswers || {},
    featureAnswers: initialData?.featureAnswers || {},
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [validatingUser, setValidatingUser] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      // Validate assigned user (only for create mode)
      if (mode === "create" && formData.assignedToUsername) {
        setValidatingUser(true)
        const validateResponse = await fetch(`/api/admin/users/validate?username=${encodeURIComponent(formData.assignedToUsername)}`)
        const validateData = await validateResponse.json()
        setValidatingUser(false)

        if (!validateResponse.ok) {
          setError(validateData.error || "Failed to validate user")
          setSubmitting(false)
          return
        }

        if (!validateData.isValid) {
          setError("User not found or is not a Health Assistant")
          setSubmitting(false)
          return
        }
      }

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

        <div className="relative inline-block w-full max-w-5xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6 max-h-[90vh]">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10 bg-white">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-4rem)] pr-2">
            <div className="w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 sticky top-0 bg-white pb-2 border-b z-10">
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

                    {mode === "create" && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign to Health Assistant (Username) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.assignedToUsername}
                          onChange={(e) => setFormData({ ...formData, assignedToUsername: e.target.value })}
                          placeholder="Enter username of health assistant"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          This screening will appear on the dashboard of the specified health assistant
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Medical History (History of Habits & HIV/HPV)</h4>
                  <div className="space-y-4">
                    {medicalQuestions.map((q) => (
                      <div key={q.id} className="border-b border-gray-200 pb-4">
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
                  <div className="space-y-4">
                    {familyQuestions.map((q) => (
                      <div key={q.id} className="border-b border-gray-200 pb-4">
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
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Symptoms & Features</h4>
                  <div className="space-y-6">
                    {featureQuestions.map((q) => (
                      <div key={q.id} className="border-b border-gray-200 pb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {q.label}
                        </label>
                        
                        {q.type === "image" && q.images ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                              {q.images.map((img) => {
                                const currentAnswer = formData.featureAnswers[q.id]
                                let isSelected = false
                                
                                if (currentAnswer) {
                                  // Check if it's a simple string match (single ID)
                                  if (currentAnswer === img.id) {
                                    isSelected = true
                                  } else if (currentAnswer.startsWith('[')) {
                                    // It's a JSON array
                                    try {
                                      const parsedArray = JSON.parse(currentAnswer)
                                      isSelected = parsedArray.includes(Number(img.id)) || parsedArray.includes(img.id)
                                    } catch (e) {
                                      // If parsing fails, treat as simple string
                                      isSelected = currentAnswer === img.id
                                    }
                                  }
                                }
                                
                                return (
                                  <div
                                    key={img.id}
                                    onClick={() => updateFeatureAnswer(q.id, img.id)}
                                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
                                      isSelected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"
                                    }`}
                                  >
                                    <Image
                                      src={img.url}
                                      alt={`Option ${img.id}`}
                                      fill
                                      className="object-cover"
                                    />
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex gap-4 mt-3">
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
                        ) : (
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
                        )}
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
                    disabled={submitting || validatingUser}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {validatingUser ? "Validating..." : submitting ? "Saving..." : mode === "create" ? "Create Patient" : "Update Patient"}
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
