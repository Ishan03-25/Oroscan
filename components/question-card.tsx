"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { useState } from "react"

interface QuestionCardProps {
  question: string
  onAnswer: (value: string) => void
  selected?: string
  showMoreInfo?: boolean
}

export default function QuestionCard({ question, onAnswer, selected, showMoreInfo }: QuestionCardProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card dark:bg-slate-800 rounded-xl p-6 border border-border dark:border-slate-700 hover:shadow-md dark:hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-lg font-semibold text-red-600 dark:text-red-400">{question}</p>
        {showMoreInfo && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowInfo(!showInfo)}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 ml-2 transition-colors duration-300"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-3 mb-4 rounded text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300"
        >
          Additional information about this question will be displayed here.
        </motion.div>
      )}

      <div className="flex gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => onAnswer("yes")}
            variant={selected === "yes" ? "default" : "outline"}
            className={`rounded-full px-6 font-semibold transition-all duration-300 ${
              selected === "yes"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
            }`}
          >
            Yes
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => onAnswer("no")}
            variant={selected === "no" ? "default" : "outline"}
            className={`rounded-full px-6 font-semibold transition-all duration-300 ${
              selected === "no"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
            }`}
          >
            No
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
