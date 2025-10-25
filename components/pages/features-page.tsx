"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import TabNavigation from "@/components/tab-navigation"
import QuestionCard from "@/components/question-card"
import ImageSelector from "@/components/image-selector"
import ProgressBar from "@/components/progress-bar"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface FeaturesPageProps {
  onNext: () => void
  onBack: () => void
}

export default function FeaturesPage({ onNext, onBack }: FeaturesPageProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedImage, setSelectedImage] = useState<string>("")

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

  const mouthImages = [
    { id: 1, label: "Condition 1", url: "/mouth-condition-1.jpg" },
    { id: 2, label: "Condition 2", url: "/mouth-condition-2.jpg" },
    { id: 3, label: "Condition 3", url: "/mouth-condition-3.jpg" },
    { id: 4, label: "Condition 4", url: "/mouth-condition-4.jpg" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <TabNavigation activeTab="features" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">Step 4 of 5</span>
          <div className="flex-1">
            <ProgressBar current={4} total={5} />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-foreground dark:text-slate-100">
            Features Inside Mouth
          </motion.h2>

          {/* Question 1 */}
          <motion.div variants={itemVariants}>
            <QuestionCard
              question="Abnormal Facial asymmetry (difference in shape/size on two sides of the face) ?"
              onAnswer={(value) => handleAnswer("asymmetry", value)}
              selected={answers["asymmetry"]}
            />
          </motion.div>

          {/* Question 2 */}
          <motion.div variants={itemVariants}>
            <QuestionCard
              question="Red or white patches in the mouth (Choose the closest to what you see) ?"
              onAnswer={(value) => handleAnswer("patches", value)}
              selected={answers["patches"]}
              showMoreInfo
            />
          </motion.div>

          {/* Image Selector */}
          <motion.div variants={itemVariants}>
            <ImageSelector
              images={mouthImages}
              selected={selectedImage}
              onSelect={setSelectedImage}
              title="Lumps or thick spots in the mouth (Choose closest to which what you see)"
            />
          </motion.div>

          {/* Question 3 */}
          <motion.div variants={itemVariants}>
            <QuestionCard
              question="Sore or Ulcer in the mouth ?"
              onAnswer={(value) => handleAnswer("sore", value)}
              selected={answers["sore"]}
              showMoreInfo
            />
          </motion.div>

          {/* Question 4 */}
          <motion.div variants={itemVariants}>
            <QuestionCard
              question="Is there any unexplained, painless, persistent lumps in the neck that do not go away ?"
              onAnswer={(value) => handleAnswer("lumps", value)}
              selected={answers["lumps"]}
              showMoreInfo
            />
          </motion.div>

          {/* Question 5 */}
          <motion.div variants={itemVariants}>
            <QuestionCard
              question="Is there any change in speech, such as a lisp ?"
              onAnswer={(value) => handleAnswer("speech", value)}
              selected={answers["speech"]}
            />
          </motion.div>

          {/* Question 6 */}
          <motion.div variants={itemVariants}>
            <QuestionCard
              question="Is there any difficulty chewing or swallowing ?"
              onAnswer={(value) => handleAnswer("chewing", value)}
              selected={answers["chewing"]}
            />
          </motion.div>

          {/* Question 7 */}
          <motion.div variants={itemVariants}>
            <QuestionCard
              question="Is there any unexplained oral/facial pain or a perpetual sore throat ?"
              onAnswer={(value) => handleAnswer("pain", value)}
              selected={answers["pain"]}
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
