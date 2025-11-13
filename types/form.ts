export interface PatientFormData {
  username: string
  name: string
  age: string
  gender: string
  phone: string
  healthAssistant: string
  address: string
  medicalAnswers: Record<string, string>
  familyAnswers: Record<string, string>
  featureAnswers: Record<string, string>
  uploadedImages: File[]
}

export interface PatientFormResponse {
  success: boolean
  patientId: string
  diagnosis: {
    result: string
    confidence: number
    metadata: any
  }
}