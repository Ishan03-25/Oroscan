"use client"

import { Dispatch, SetStateAction } from "react"
import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TabNavigation from "@/components/tab-navigation"
import ProgressBar from "@/components/progress-bar"
import { ArrowRight, User, Phone, MapPin, Users } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface FormData {
  username: string
  name: string
  age: string
  gender: string
  phone: string
  healthAssistant: string
  address: string
}

interface ProfilePageProps {
  formData: FormData
  setFormData: Dispatch<SetStateAction<FormData>>
  onNext: () => void
}

export default function ProfilePage({ formData, setFormData, onNext }: ProfilePageProps) {
  const { t, all } = useTranslation("profile")
  const profile = all()

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  }

  const fieldVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] },
    },
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
              {t("title")}
            </h2>
            <p className="text-muted-foreground dark:text-slate-400">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Name, Age, Gender Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                {t("name")}
              </label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input
                  type="text"
                  placeholder={t("name")}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 text-foreground dark:text-slate-100"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200">
                {t("age")}
              </label>
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
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200">
                {t("gender")}
              </label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 text-foreground dark:text-slate-100"
                >
                  <option value="">--</option>
                  <option value="male">{profile.genderOptions.male}</option>
                  <option value="female">{profile.genderOptions.female}</option>
                  <option value="other">{profile.genderOptions.other}</option>
                </select>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Phone and Health Assistant Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                {t("phone")}
              </label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input
                  type="tel"
                  placeholder={t("phone")}
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 text-foreground dark:text-slate-100"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={fieldVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-foreground dark:text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                {t("healthAssistant")}
              </label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input
                  type="text"
                  placeholder={t("healthAssistant")}
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
              {t("address")}
            </label>
            <motion.div whileFocus={{ scale: 1.02 }}>
              <textarea
                placeholder={t("address")}
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                className="w-full border-2 border-border dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-3 transition-all duration-300 bg-muted dark:bg-slate-700 focus:bg-background dark:focus:bg-slate-600 text-foreground dark:text-slate-100 resize-none"
              />
            </motion.div>
          </motion.div>

          {/* Next Button */}
          <motion.div variants={itemVariants} className="pt-4 flex justify-end">
            <Button
              onClick={onNext}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl px-8 py-3 hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
