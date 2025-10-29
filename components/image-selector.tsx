"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageSelectorProps {
  images: Array<{ id: number; label: string; url: string }>
  selected: string
  onSelect: (id: string) => void
  title?: string
}

export default function ImageSelector({ images, selected, onSelect, title }: ImageSelectorProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  return (
    <div className="bg-card dark:bg-slate-800 rounded-xl p-6 border border-border dark:border-slate-700">
      {title && <p className="text-lg font-semibold text-red-600 mb-6">{title}</p>}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {images.map((img) => (
          <motion.div
            key={img.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(String(img.id))}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              selected === String(img.id)
                ? "border-blue-600 shadow-lg"
                : "border-border dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <div className="relative w-full aspect-square bg-muted dark:bg-slate-700">
              <Image src={img.url || "/placeholder.svg"} alt={img.label} fill className="object-cover" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* None of Above Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Button
          onClick={() => onSelect("none")}
          className={`w-full rounded-full font-semibold py-3 ${
            selected === "none"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          None of Above
        </Button>
      </motion.div>
    </div>
  )
}
