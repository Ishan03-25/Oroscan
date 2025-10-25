"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import TabNavigation from "@/components/tab-navigation"
import QuestionCard from "@/components/question-card"
import ProgressBar from "@/components/progress-bar"
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react"

interface FamilyHistoryPageProps {
  onNext: () => void
  onBack: () => void
}

export default function FamilyHistoryPage({ onNext, onBack }: FamilyHistoryPageProps) {
  const [answer, setAnswer] = useState<string>("")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <TabNavigation activeTab="family" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">Step 3 of 5</span>
          <div className="flex-1">
            <ProgressBar current={3} total={5} />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-card dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-8 border border-border dark:border-slate-700 transition-colors duration-300"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-foreground dark:text-slate-100">
            Family History
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-4 rounded transition-colors duration-300"
          >
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">
                  Family history of Head, neck, throat or oral cancer in blood relatives ?
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Please indicate if any of your blood relatives have had cancer of the head, neck, throat, or mouth.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <QuestionCard
              question="Family history of Head, neck, throat or oral cancer in blood relatives ?"
              onAnswer={setAnswer}
              selected={answer}
              showMoreInfo
            />
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-between pt-6 border-t border-border dark:border-slate-700"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onBack}
                variant="outline"
                className="border-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 font-semibold px-8 py-3 rounded-lg flex items-center gap-2 bg-transparent transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNext}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
