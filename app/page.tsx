"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import LoginPage from "@/components/pages/login-page"
export default function RootLogin() {
  const router = useRouter()

  const handleLogin = useCallback(
    (username: string) => {
      try {
        localStorage.setItem("oroscan_username", username)
      } catch {}
      router.push("/home")
    },
    [router]
  )

  return <LoginPage onLogin={handleLogin} />
}
