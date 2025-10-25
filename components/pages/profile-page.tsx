"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TabNavigation from "@/components/tab-navigation"
import ProgressBar from "@/components/progress-bar"
import { ArrowRight, User, Phone, MapPin, Users } from "lucide-react"

interface ProfilePageProps {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
}

export default function ProfilePage({ formData, setFormData, onNext }: ProfilePageProps) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <TabNavigation activeTab="profile" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">Step 1 of 5</span>
          <div className="flex-1">
            <ProgressBar current={1} total={5} />
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
          className="bg-card dark:bg-slate-800 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-8 border border-border dark:border-slate-700 transition-colors duration-300"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Patient Information
            </h2>
            <p className="text-muted-foreground dark:text-slate-400">
              Please fill in your details to proceed with the screening
            </p>
          </motion.div>

          {/* Name, Age, Gender Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Full Name
              </label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 text-foreground dark:text-slate-100"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200">Age</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  className="border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 text-foreground dark:text-slate-100"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200">Gender</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 transition-all duration-300 font-medium text-foreground dark:text-slate-100"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Phone and Health Assistant Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Phone Number
              </label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 text-foreground dark:text-slate-100"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Health Assistant's Name
              </label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input
                  type="text"
                  placeholder="Assistant name"
                  value={formData.healthAssistant}
                  onChange={(e) => handleChange("healthAssistant", e.target.value)}
                  className="border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 text-foreground dark:text-slate-100"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Address */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-foreground dark:text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Address
            </label>
            <motion.div whileFocus={{ scale: 1.02 }}>
              <textarea
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={4}
                className="w-full border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 resize-none transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 font-medium text-foreground dark:text-slate-100"
              />
            </motion.div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-end pt-6 border-t-2 border-border dark:border-slate-700"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNext}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
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
