import {requireAuth} from "@/lib/auth"
import { type Metadata } from "next"
import HomeFlow from "./home-flow"

export const metadata: Metadata = {
  title: "Home - Oroscan",
  description: "Oral Cancer Screening System",
}

interface HomePageProps {
  searchParams: Promise<{ edit?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const user = await requireAuth()
  const params = await searchParams
  const editPatientId = params.edit
  
  return <HomeFlow username={user.username} editPatientId={editPatientId} />
}

