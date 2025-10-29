"use client"

import { motion } from "framer-motion"
import { LogOut, Menu, LayoutDashboard, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  username: string
  onLogout: () => void
  onToggleSidebar?: () => void
  onDashboard?: () => void
  onLanguageChange?: (lang: string) => void
}

export default function Header({ 
  username, 
  onLogout, 
  onToggleSidebar,
  onDashboard,
  onLanguageChange,
}: HeaderProps) {
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1.5 bg-muted hover:bg-accent dark:bg-muted/50 dark:hover:bg-accent/50 rounded-full transition-colors duration-200 cursor-pointer group outline-none">
                <Avatar className="size-6 bg-primary text-primary-foreground shadow-sm">
                  <AvatarFallback className="text-xs font-medium">
                    {username ? username.slice(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground group-hover:text-accent-foreground">
                  {username || 'User'}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => onDashboard?.()}
                className="px-3 py-2 text-sm cursor-pointer"
                disabled={!onDashboard}
              >
                <LayoutDashboard className="mr-2.5 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="px-3 py-2 text-sm">
                  <Languages className="mr-2.5 h-4 w-4" />
                  <span>Language</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-32">
                    <DropdownMenuItem 
                      onClick={() => onLanguageChange?.('en')}
                      className="px-3 py-2 text-sm"
                    >
                      <span className="ml-6.5">English</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onLanguageChange?.('hi')}
                      className="px-3 py-2 text-sm"
                    >
                      <span className="ml-6.5">हिंदी</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onLanguageChange?.('bn')}
                      className="px-3 py-2 text-sm"
                    >
                      <span className="ml-6.5">বাংলা</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem 
                onClick={onLogout} 
                variant="destructive"
                className="px-3 py-2 text-sm text-red-600 focus:text-red-50 focus:bg-red-600"
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </motion.header>
  )
}
