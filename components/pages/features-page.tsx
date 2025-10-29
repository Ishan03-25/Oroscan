"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import TabNavigation from "@/components/tab-navigation"
import QuestionCard from "@/components/question-card"
import ImageSelector from "@/components/image-selector"
import ProgressBar from "@/components/progress-bar"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface FeaturesPageProps {
  onNext: () => void
  onBack: () => void
}

export default function FeaturesPage({ onNext, onBack }: FeaturesPageProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const { t } = useTranslation("features")
  const { t: tc } = useTranslation("common")

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

  // Images for the different image-selection questions
  const asymmetryImages = [{ id: 1, label: t("swelling"), url: "/mouth/assymetry.png" }]

  const patchesImages = Array.from({ length: 13 }).map((_, i) => ({
    id: i + 1,
    label: `${t("patches")} ${i + 1}`,
    url: `/mouth/patch-${i + 1}.png`,
  }))

  const lumpsImages = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 1,
    label: `${t("lumps_mouth")} ${i + 1}`,
    url: `/mouth/lumps-${i + 1}.png`,
  }))

  const trismusImage = { id: 1, label: t("trismus"), url: "/mouth/trismus.png" }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <TabNavigation activeTab="features" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">{`Step 4 of 5`}</span>
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
            {t("title")}
          </motion.h2>

          {/* Question 1 - Asymmetry (one image) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("swelling")}</p>
            <ImageSelector
              images={asymmetryImages}
              selected={answers["asymmetry"] || ""}
              onSelect={(id) => handleAnswer("asymmetry", id)}
            />
          </motion.div>

          {/* Question 2 - Red/White patches (13 images) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("patches")}</p>
            <ImageSelector
              images={patchesImages}
              selected={answers["patches_image"] || ""}
              onSelect={(id) => handleAnswer("patches_image", id)}
            />
          </motion.div>

          {/* Question 3 - Sore/Ulcer (yes/no) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("bleeding")}</p>
            <div className="bg-card dark:bg-slate-800 rounded-xl p-6 border border-border dark:border-slate-700">
              <div className="flex gap-3">
                <div>
                  <Button
                    onClick={() => handleAnswer("sore", "yes")}
                    variant={answers["sore"] === "yes" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["sore"] === "yes"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    Yes
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => handleAnswer("sore", "no")}
                    variant={answers["sore"] === "no" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["sore"] === "no"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Question 4 - Neck lumps (yes/no) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("lumps")}</p>
            <div className="bg-card dark:bg-slate-800 rounded-xl p-6 border border-border dark:border-slate-700">
              <div className="flex gap-3">
                <div>
                  <Button
                    onClick={() => handleAnswer("neck_lumps", "yes")}
                    variant={answers["neck_lumps"] === "yes" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["neck_lumps"] === "yes"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    Yes
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => handleAnswer("neck_lumps", "no")}
                    variant={answers["neck_lumps"] === "no" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["neck_lumps"] === "no"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Question 5 - Lumps or thick spots in mouth (4 images + none of above) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("lumps_mouth")}</p>
            <ImageSelector
              images={lumpsImages}
              selected={answers["lumps_mouth"] || ""}
              onSelect={(id) => handleAnswer("lumps_mouth", id)}
            />
          </motion.div>

          {/* Question 6 - Change in speech (yes/no) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("speech")}</p>
            <div className="bg-card dark:bg-slate-800 rounded-xl p-6 border border-border dark:border-slate-700">
              <div className="flex gap-3">
                <div>
                  <Button
                    onClick={() => handleAnswer("speech", "yes")}
                    variant={answers["speech"] === "yes" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["speech"] === "yes"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    Yes
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => handleAnswer("speech", "no")}
                    variant={answers["speech"] === "no" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["speech"] === "no"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Question 7 - Difficulty chewing/swallowing (yes/no) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("chewing")}</p>
            <div className="bg-card dark:bg-slate-800 rounded-xl p-6 border border-border dark:border-slate-700">
              <div className="flex gap-3">
                <div>
                  <Button
                    onClick={() => handleAnswer("chewing", "yes")}
                    variant={answers["chewing"] === "yes" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["chewing"] === "yes"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    Yes
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => handleAnswer("chewing", "no")}
                    variant={answers["chewing"] === "no" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["chewing"] === "no"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Question 8 - Oral/facial pain or perpetual sore throat (yes/no) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("oral_pain")}</p>
            <div className="bg-card dark:bg-slate-800 rounded-xl p-6 border border-border dark:border-slate-700">
              <div className="flex gap-3">
                <div>
                  <Button
                    onClick={() => handleAnswer("oral_pain", "yes")}
                    variant={answers["oral_pain"] === "yes" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["oral_pain"] === "yes"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    Yes
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => handleAnswer("oral_pain", "no")}
                    variant={answers["oral_pain"] === "no" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["oral_pain"] === "no"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Question 9 - Trismus test (image + yes/no) */}
          <motion.div variants={itemVariants}>
            <p className="text-lg font-semibold text-red-600 mb-4">{t("trismus")}</p>
            <div className="bg-card dark:bg-slate-800 rounded-xl p-6 border border-border dark:border-slate-700 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
              <div className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden border border-border dark:border-slate-700">
                <div className="relative w-full aspect-[4/3] bg-muted dark:bg-slate-700">
                  <Image src={trismusImage.url} alt={trismusImage.label} fill className="object-cover" />
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <Button
                    onClick={() => handleAnswer("trismus", "yes")}
                    variant={answers["trismus"] === "yes" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["trismus"] === "yes"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    Yes
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => handleAnswer("trismus", "no")}
                    variant={answers["trismus"] === "no" ? "default" : "outline"}
                    className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                      answers["trismus"] === "no"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                        : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                    }`}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
            {/* <div className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden border border-slate-200">
              <div className="relative w-full aspect-[4/3] bg-muted dark:bg-slate-700">
                <Image src={trismusImage.url} alt={trismusImage.label} fill className="object-cover" />
              </div>
            </div>
            <div className="flex gap-3">
              <div>
                <Button
                  onClick={() => handleAnswer("trismus", "yes")}
                  variant={answers["trismus"] === "yes" ? "default" : "outline"}
                  className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                    answers["trismus"] === "yes"
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                      : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                  }`}
                >
                  Yes
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => handleAnswer("trismus", "no")}
                  variant={answers["trismus"] === "no" ? "default" : "outline"}
                  className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                    answers["trismus"] === "no"
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 dark:from-teal-600 dark:to-teal-700"
                      : "border-2 border-teal-500 text-teal-600 dark:text-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                  }`}
                >
                  No
                </Button>
              </div>
            </div> */}
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
