import NextAuth, { type DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import { type Account, type Profile } from "next-auth"
import prisma from "./prisma"
import bcrypt from "bcryptjs"

interface DbUser {
  id: string
  email: string | null
  username: string
  name: string | null
  password: string
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
    } & DefaultSession["user"]
  }
}

interface AuthError {
  message: string
  code: "InvalidEmail" | "InvalidUsername" | "InvalidPassword" | "MissingCredentials"
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier?.toString().trim()
        const password = credentials?.password?.toString()
        if (!identifier || !password) return null

        let user = null
        try {
          if (identifier.includes("@")) {
            user = await prisma.user.findFirst({ where: { email: { equals: identifier, mode: "insensitive" } } })
          } else {
            user = await prisma.user.findFirst({ where: { OR: [{ username: { equals: identifier, mode: "insensitive" } }, { email: { equals: identifier, mode: "insensitive" } }] } })
          }
        } catch (e) {
          // fallback if `mode: 'insensitive'` unsupported
          if (identifier.includes("@")) {
            user = await prisma.user.findFirst({ where: { email: identifier } })
          } else {
            user = await prisma.user.findFirst({ where: { OR: [{ username: identifier }, { email: identifier }] } })
          }
        }

        console.debug("auth: attempt", { identifier, foundUserId: user?.id ?? null })

        if (!user || !user.password) {
          // Return null to indicate invalid credentials without throwing
          return null
        }
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
          // Invalid password -> let NextAuth handle as CredentialsSignin
          return null
        }
        return { 
          id: user.id, 
          name: user.name ?? undefined, 
          email: user.email ?? undefined,
          username: user.username // Add username to returned user object
        }
      },
    }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any; token: any; user: any }) {
      if (session.user) {
        // Add user ID and username from JWT token
        session.user.id = token.sub as string
        session.user.username = token.username as string
      }
      return session
    },
    async jwt({ token, user, account, profile }: { 
      token: JWT & { username?: string }
      user: DbUser | null
      account: Account | null
      profile?: Profile
    }) {
      if (user) {
        // After initial sign in, add username to JWT
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id ?? token.sub },
          select: { username: true }
        })
        token.username = dbUser?.username
      }
      return token
    },
  },
}

// Proper NextAuth v5 export shape
const nextAuth = NextAuth(authOptions as any)
export const { handlers, auth, signIn, signOut } = nextAuth as any

// Helper to require authentication from server components / routes.
// Usage: const user = await requireAuth()
import { redirect } from "next/navigation"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    // not authenticated -> redirect to login
    redirect("/")
  }
  return session.user
}

