import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import AdminLayoutClient from "@/components/admin/AdminLayoutClient"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Check if user is authenticated
  if (!session?.user) {
    redirect("/")
  }
  
  // Check if user has ADMIN role
  if (session.user.role !== 'ADMIN') {
    redirect("/dashboard")
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
