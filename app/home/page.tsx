import {requireAuth} from "@/lib/auth"
import { type Metadata } from "next"
import HomeFlow from "./home-flow"

export const metadata: Metadata = {
  title: "Home - Oroscan",
  description: "Oral Cancer Screening System",
}

export default async function HomePage() {
  const user = await requireAuth()
  return <HomeFlow username={user.username} />
}

