"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { PatientFormData, PatientFormResponse } from "@/types/form"
import { toast } from "@/components/ui/use-toast"
import AppShell from "@/components/app-shell"
import ProfilePage from "@/components/pages/profile-page"
import MedicalHistoryPage from "@/components/pages/medical-history-page"
import FamilyHistoryPage from "@/components/pages/family-history-page"
import FeaturesPage from "@/components/pages/features-page"
import InputDevicePage from "@/components/pages/input-device-page"
import Footer from "@/components/footer"
import { signOut } from "next-auth/react"
import { toast as showToast } from '@/hooks/use-toast'
import TabNavigation from "@/components/tab-navigation"

type PageType = "profile" | "medical" | "family" | "features" | "device"

interface HomeFlowProps {
  username: string
  editPatientId?: string
}

export default function HomeFlow({ username, editPatientId }: HomeFlowProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<PageType>("profile")
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(!!editPatientId)
  const [formData, setFormData] = useState({
    username,
    name: "",
    age: "",
    gender: "",
    phone: "",
    healthAssistant: "",
    address: "",
    medicalAnswers: {} as Record<string, string>,
    familyAnswers: {} as Record<string, string>,
    featureAnswers: {} as Record<string, string>,
    uploadedImages: [] as File[],
  })

  // Fetch patient data if in edit mode
  useEffect(() => {
    if (editPatientId) {
      fetchPatientData(editPatientId)
    }
  }, [editPatientId])

  const fetchPatientData = async (patientId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/patients/edit?id=${patientId}`)
      if (response.ok) {
        const data = await response.json()
        const patient = data.patient
        
        setFormData({
          username,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          healthAssistant: patient.healthAssistant,
          address: patient.address,
          medicalAnswers: patient.medicalAnswers,
          familyAnswers: patient.familyAnswers,
          featureAnswers: patient.featureAnswers,
          uploadedImages: [],
        })
        
        setIsEditMode(true)
        
        showToast({
          title: 'Edit Mode',
          description: `Editing patient: ${patient.name}`,
          className: 'bg-blue-600 text-white border-blue-700',
        })
      } else {
        showToast({
          title: 'Error',
          description: 'Failed to load patient data',
          variant: 'destructive',
        })
        router.push('/dashboard')
      }
    } catch (error) {
      console.error("Failed to fetch patient data:", error)
      showToast({
        title: 'Error',
        description: 'Failed to load patient data',
        variant: 'destructive',
      })
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = useCallback(async () => {
    try {
      // use redirect: false so we can show a toast before navigating
      const res = await signOut({ redirect: false })
      // show success toast
      try {
        const t = showToast({
          title: 'Signed out',
          description: 'You have signed out successfully.',
          className: 'max-w-md mx-auto bg-emerald-600 text-white border-emerald-700',
        })
        setTimeout(() => t.dismiss(), 2000)
      } catch (e) {
        console.warn('toast error', e)
      }

      // navigate to login
      // if signOut returned a url string, prefer it, otherwise go to '/'
      if (typeof res === 'string') {
        router.replace(res)
      } else {
        router.replace('/')
      }
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }, [])

  const handleNavigate = (page: PageType) => setCurrentPage(page)

  const handleResetAndHome = () => {
    // Reset all form data
    setFormData({
      username,
      name: "",
      age: "",
      gender: "",
      phone: "",
      healthAssistant: "",
      address: "",
      medicalAnswers: {} as Record<string, string>,
      familyAnswers: {} as Record<string, string>,
      featureAnswers: {} as Record<string, string>,
      uploadedImages: [] as File[],
    })
    
    // Reset edit mode
    setIsEditMode(false)
    
    // Navigate back to profile page
    setCurrentPage("profile")
    
    // Show success toast
    showToast({
      title: 'Ready for New Screening',
      description: 'Form has been reset. You can start a new screening.',
      className: 'bg-green-600 text-white border-green-700',
    })
  }

  const getCurrentPage = () => {
    switch (currentPage) {
      case "profile":
        return <ProfilePage formData={formData} setFormData={setFormData} onNext={() => handleNavigate("medical")} />
      case "medical":
        return <MedicalHistoryPage 
          formData={formData}
          setFormData={setFormData}
          onNext={() => handleNavigate("family")}
          onBack={() => handleNavigate("profile")}
        />
      case "family":
        return <FamilyHistoryPage
          formData={formData}
          setFormData={setFormData}
          onNext={() => handleNavigate("features")}
          onBack={() => handleNavigate("medical")}
        />
      case "features":
        return <FeaturesPage
          formData={formData}
          setFormData={setFormData}
          onNext={() => handleNavigate("device")}
          onBack={() => handleNavigate("family")}
        />
      case "device":
        return <InputDevicePage 
          onBack={() => handleNavigate("features")} 
          formData={formData} 
          editPatientId={editPatientId}
          onResetAndHome={handleResetAndHome}
        />
      default:
        return null
    }
  }

  const { setLanguage } = useLanguage()
  
  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang as "en" | "hi" | "bn")
  }, [setLanguage])

  return (
    <AppShell 
      username={username} 
      onLogout={handleLogout}
      onLanguageChange={handleLanguageChange}
    >
      <TabNavigation activeTab={currentPage} onTabChange={handleNavigate} />
      <div className="container mx-auto py-6 max-w-5xl min-h-[calc(100vh-4rem)]">
        {getCurrentPage()}
      </div>
      <Footer />
    </AppShell>
  )
}