"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Language, detectBrowserLanguage } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with browser language or fallback to English
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const detected = detectBrowserLanguage()
    setLanguage(detected)
    // Try to get from localStorage
    const stored = localStorage.getItem("language") as Language
    if (stored && ["en", "hi", "bn"].includes(stored)) {
      setLanguage(stored)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    // Optional: Update HTML lang attribute
    document.documentElement.lang = lang
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}