"use client"

import React from "react"
import AppShell from "@/components/app-shell"
import { useSession, signOut } from "next-auth/react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const username = session?.user?.name ?? session?.user?.email ?? "User"

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
