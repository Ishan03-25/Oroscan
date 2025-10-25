"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-muted border-t border-border py-6 mt-auto transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 OROSCAN | All Right Reserved <Heart className="w-4 h-4 inline text-red-500 mx-1" />
          Developed by – Prof. Suman Chakraborty's group at IIT Kharagpur
        </p>
      </div>
    </motion.footer>
  )
}
