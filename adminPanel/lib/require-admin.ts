import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const session = await auth()
  
  if (!session?.user) {
    // not authenticated -> redirect to main site login
    redirect("http://localhost:3000")
  }
  
  if (session.user.role !== 'ADMIN') {
    // not admin -> redirect to main site dashboard
    redirect("http://localhost:3000/dashboard")
  }
  
  return session.user
}
