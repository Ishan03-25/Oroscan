"use client"

import { motion } from "framer-motion"
import { LogOut, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

interface HeaderProps {
  username: string
  onLogout: () => void
  onToggleSidebar?: () => void
}

export default function Header({ username, onLogout, onToggleSidebar }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background border-b border-border shadow-sm sticky top-0 z-50 h-16 transition-colors duration-300"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
            className="mr-1 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-800 dark:from-primary dark:to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-bold text-lg">O</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Oroscan</h1>
            <p className="text-xs text-muted-foreground">Oral Cancer Screening</p>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
          <ThemeToggle />

          <div className="flex items-center gap-2 px-4 py-2 bg-muted dark:bg-muted/50 rounded-full transition-colors duration-300">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{username}</span>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.header>
  )
}
