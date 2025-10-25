"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import AppShell from "@/components/app-shell"
import ProfilePage from "@/components/pages/profile-page"
import MedicalHistoryPage from "@/components/pages/medical-history-page"
import FamilyHistoryPage from "@/components/pages/family-history-page"
import FeaturesPage from "@/components/pages/features-page"
import InputDevicePage from "@/components/pages/input-device-page"
import Footer from "@/components/footer"

type PageType = "profile" | "medical" | "family" | "features" | "device"

export default function HomeFlow() {
  const router = useRouter()
  const [username, setUsername] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<PageType>("profile")
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    age: "",
    gender: "",
    phone: "",
    healthAssistant: "",
    address: "",
  })

  useEffect(() => {
    try {
      const u = localStorage.getItem("oroscan_username") || ""
      if (!u) {
        router.replace("/")
        return
      }
      setUsername(u)
      setFormData((prev) => ({ ...prev, username: u }))
    } catch {
      router.replace("/")
    }
  }, [router])

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("oroscan_username")
    } catch {}
    router.replace("/")
  }, [router])

  const handleNavigate = (page: PageType) => setCurrentPage(page)

  const renderPage = () => {
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

  if (!username) return null

  return (
    <AppShell username={username} onLogout={handleLogout}>
      <main className="min-h-[calc(100vh-4rem)]">
        {renderPage()}
      </main>
      <Footer />
    </AppShell>
  )
}
