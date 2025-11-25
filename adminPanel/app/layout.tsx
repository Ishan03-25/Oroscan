import type { Metadata } from "next"
import "./globals.css"
import AdminLayout from "./components/AdminLayout"

export const metadata: Metadata = {
  title: "Oroscan Admin Panel",
  description: "Admin panel for Oroscan oral cancer screening platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  )
}
