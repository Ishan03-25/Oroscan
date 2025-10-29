"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import AppShell from "@/components/app-shell"
import ProfilePage from "@/components/pages/profile-page"
import MedicalHistoryPage from "@/components/pages/medical-history-page"
import FamilyHistoryPage from "@/components/pages/family-history-page"
import FeaturesPage from "@/components/pages/features-page"
import InputDevicePage from "@/components/pages/input-device-page"
import Footer from "@/components/footer"
import { signOut } from "next-auth/react"
import { toast as showToast } from '@/hooks/use-toast'

type PageType = "profile" | "medical" | "family" | "features" | "device"

interface HomeFlowProps {
  username: string
}

export default function HomeFlow({ username }: HomeFlowProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<PageType>("profile")
  const [formData, setFormData] = useState({
    username,
    name: "",
    age: "",
    gender: "",
    phone: "",
    healthAssistant: "",
    address: "",
  })

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

  const getCurrentPage = () => {
    switch (currentPage) {
      case "profile":
        return <ProfilePage formData={formData} setFormData={setFormData} onNext={() => handleNavigate("medical")} />
      case "medical":
        return <MedicalHistoryPage onNext={() => handleNavigate("family")} onBack={() => handleNavigate("profile")} />
      case "family":
        return <FamilyHistoryPage onNext={() => handleNavigate("features")} onBack={() => handleNavigate("medical")} />
      case "features":
        return <FeaturesPage onNext={() => handleNavigate("device")} onBack={() => handleNavigate("family")} />
      case "device":
        return <InputDevicePage onBack={() => handleNavigate("features")} />
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
      <div className="container mx-auto py-6 max-w-5xl min-h-[calc(100vh-4rem)]">
        {getCurrentPage()}
      </div>
      <Footer />
    </AppShell>
  )
}