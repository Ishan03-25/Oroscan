import { Metadata } from "next"
import LoginPage from "@/components/pages/login-page"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login - Oroscan",
  description: "Login to Oroscan - Oral Cancer Screening System",
}

export default async function Page() {
  // If already logged in, redirect to home
  const session = await auth()
  if (session?.user) {
    redirect("/home")
  }

  return <LoginPage />
}
