"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import TabNavigation from "@/components/tab-navigation"
import ProgressBar from "@/components/progress-bar"
import { ArrowLeft, Upload, CheckCircle } from "lucide-react"

interface InputDevicePageProps {
  onBack: () => void
}

export default function InputDevicePage({ onBack }: InputDevicePageProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

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
      <TabNavigation activeTab="device" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">Step 5 of 5</span>
          <div className="flex-1">
            <ProgressBar current={5} total={5} />
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
            Upload Images from Device
          </motion.h2>

          {!isSubmitted ? (
            <>
              <motion.div
                variants={itemVariants}
                className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 transition-colors duration-300"
              >
                <p className="text-foreground dark:text-slate-200 font-medium mb-4">You can choose multiple images:</p>
                <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-300">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Choose Files</span>
                    <p className="text-sm text-muted-foreground dark:text-slate-400 mt-1">or drag and drop</p>
                  </div>
                  <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                </label>
              </motion.div>

              {files.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 transition-colors duration-300"
                >
                  <p className="text-green-900 dark:text-green-200 font-semibold mb-3">
                    {files.length} file(s) selected:
                  </p>
                  <ul className="space-y-2">
                    {files.map((file, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {file.name}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

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
                    onClick={handleSubmit}
                    disabled={isSubmitting || files.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg disabled:opacity-50 transition-all duration-300"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </motion.div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300"
              >
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground dark:text-slate-100 mb-2">Submission Successful!</h3>
              <p className="text-muted-foreground dark:text-slate-400 mb-6">
                Your screening information has been submitted successfully.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
                >
                  Back to Home
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
