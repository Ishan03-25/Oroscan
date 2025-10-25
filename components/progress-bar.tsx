"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-sm">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-full shadow-lg"
      />
    </div>
  )
}
