import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

interface AuthError {
  message: string
  code: "InvalidEmail" | "InvalidUsername" | "InvalidPassword" | "MissingCredentials"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error(JSON.stringify({
            message: "Email/username and password are required",
            code: "MissingCredentials",
          } satisfies AuthError))
        }

        const identifier = String(credentials.identifier).trim()
        const password = String(credentials.password)

        const { prisma } = await import("@/lib/prisma")

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { username: identifier },
            ],
          },
        })

        if (!user) {
          // Check if it looks like an email to give a more specific error
          const isEmail = identifier.includes("@")
          throw new Error(JSON.stringify({
            message: isEmail 
              ? "No account found with this email address"
              : "No account found with this username",
            code: isEmail ? "InvalidEmail" : "InvalidUsername",
          } satisfies AuthError))
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
          throw new Error(JSON.stringify({
            message: "Incorrect password",
            code: "InvalidPassword"
          } satisfies AuthError))
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.username,
          username: user.username,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.username = (user as any).username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id as string | undefined
        ;(session.user as any).username = token.username as string | undefined
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

