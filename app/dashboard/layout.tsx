"use client"

import React, { useEffect } from "react"
import AppShell from "@/components/app-shell"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const username = session?.user?.name ?? session?.user?.email ?? "User"

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <AppShell
      username={username}
      onLogout={() => void signOut({ callbackUrl: "/" })}
      onLanguageChange={(lang: string) => {
        // Placeholder: language switching handled by LanguageProvider elsewhere
        console.log("Requested language:", lang)
      }}
    >
      {children}
    </AppShell>
  )
}
