"use client"

import { motion } from "framer-motion"
import { User, Heart, Users, Smile, Upload } from "lucide-react"

interface TabNavigationProps {
  activeTab: "profile" | "medical" | "family" | "features" | "device"
}

export default function TabNavigation({ activeTab }: TabNavigationProps) {
  const tabs = [
    { id: "profile", label: "PROFILE", icon: User },
    { id: "medical", label: "MEDICAL HISTORY", icon: Heart },
    { id: "family", label: "FAMILY HISTORY", icon: Users },
    { id: "features", label: "FEATURES INSIDE MOUTH", icon: Smile },
    { id: "device", label: "INPUT FROM DEVICE", icon: Upload },
  ]

  return (
    <div className="bg-background border-b border-border sticky top-16 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-2 py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-blue-700 dark:from-primary dark:to-blue-600 text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 dark:hover:bg-muted/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
