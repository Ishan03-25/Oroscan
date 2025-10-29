"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import TabNavigation from "@/components/tab-navigation"
import QuestionCard from "@/components/question-card"
import ProgressBar from "@/components/progress-bar"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface MedicalHistoryPageProps {
  onNext: () => void
  onBack: () => void
}

export default function MedicalHistoryPage({ onNext, onBack }: MedicalHistoryPageProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const { t } = useTranslation("medical")
  const { t: tc } = useTranslation("common")

  const questions = [
    { id: "alcohol", label: t("q_alcohol") },
    { id: "tobacco", label: t("q_tobacco") },
    { id: "gutka", label: t("q_gutka") },
    { id: "paan", label: t("q_paan") },
    { id: "precipitation", label: t("q_precipitation") },
  ]

  const handleAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <TabNavigation activeTab="medical" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">{`Step 2 of 5`}</span>
          <div className="flex-1">
            <ProgressBar current={2} total={5} />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* History of Habits Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-xl p-4 font-semibold text-lg transition-colors duration-300"
          >
            {t("historyOfHabits")}
          </motion.div>

          {/* Questions */}
          {questions.slice(0, 5).map((q) => (
            <motion.div key={q.id} variants={itemVariants}>
              <QuestionCard
                question={q.label}
                onAnswer={(value) => handleAnswer(q.id, value)}
                selected={answers[q.id]}
              />
            </motion.div>
          ))}

          {/* HIV/HPV Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-xl p-4 font-semibold text-lg transition-colors duration-300"
          >
            {t("q_hiv")}
          </motion.div>

          <motion.div variants={itemVariants}>
            <QuestionCard
              question={t("q_hiv")}
              onAnswer={(value) => handleAnswer("hiv", value)}
              selected={answers["hiv"]}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <QuestionCard
              question={t("q_hpv")}
              onAnswer={(value) => handleAnswer("hpv", value)}
              selected={answers["hpv"]}
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
                <ArrowLeft className="w-4 h-4" /> {tc("back")}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNext}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                {tc("next")} <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
