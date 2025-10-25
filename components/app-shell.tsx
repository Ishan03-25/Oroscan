"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"

export default function AppShell({
  children,
  username,
  onLogout,
}: {
  children: React.ReactNode
  username: string
  onLogout: () => void
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header
        username={username}
        onLogout={onLogout}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main
        className={
          (sidebarOpen ? "lg:ml-64 " : "") +
          "pt-16 transition-[margin] duration-200"
        }
      >
        {children}
      </main>
    </div>
  )
}
