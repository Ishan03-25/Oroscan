"use client"

import type React from "react"
import { useState } from "react"
import { motion, Variants, Transition } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Lock, User, CheckCircle, AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AuthError {
  message: string
  code: "InvalidEmail" | "InvalidUsername" | "InvalidPassword" | "MissingCredentials"
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
  },
}

const loadingTransition: Transition = {
  duration: 1,
  repeat: Infinity,
  ease: "linear",
}

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
      })

      if (!res?.error) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push("/home")
        }, 600)
      } else {
        // Try to parse the error message as JSON (our custom error format)
        try {
          const authError = JSON.parse(res.error) as AuthError
          setError(authError)
        } catch {
          // If error isn't our custom format, show generic message
          setError({
            message: "An error occurred during login",
            code: "MissingCredentials"
          })
        }
      }
    } catch (err) {
      setError({
        message: "An error occurred during login",
        code: "MissingCredentials"
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-teal-200 dark:bg-teal-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-card/95 dark:bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-8 border border-border/50 dark:border-border/30 transition-colors duration-300"
        >
          {/* Logo and Title */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-primary-foreground font-bold text-5xl">O</span>
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Oroscan
              </h1>
              <p className="text-muted-foreground font-medium">Oral Cancer Screening System</p>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Email or Username
              </label>
              <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                <Input
                  type="text"
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all duration-300 bg-input focus:bg-card dark:bg-input dark:focus:bg-card"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </label>
              <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all duration-300 bg-input focus:bg-card dark:bg-input dark:focus:bg-card"
                />
              </motion.div>
            </motion.div>

            {error && (
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive text-destructive text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {error.message}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading || showSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                    Signing in...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Success!
                  </>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Demo Credentials */}
          <motion.div
            variants={itemVariants}
            className="bg-muted dark:bg-muted/50 border-2 border-border dark:border-border/50 rounded-2xl p-5 text-sm text-foreground space-y-2 transition-colors duration-300"
          >
            <p className="font-bold text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              Demo Credentials
            </p>
            <div className="space-y-1 ml-4">
              <p>
                Username: <span className="font-mono font-bold text-primary">demo</span>
              </p>
              <p>
                Password: <span className="font-mono font-bold text-primary">demo123</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
