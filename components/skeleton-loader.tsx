"use client"

import { motion } from "framer-motion"

interface SkeletonLoaderProps {
  type?: "card" | "input" | "button" | "text" | "image"
  count?: number
}

export default function SkeletonLoader({ type = "card", count = 1 }: SkeletonLoaderProps) {
  const shimmer = {
    initial: { backgroundPosition: "200% center" },
    animate: { backgroundPosition: "-200% center" },
  }

  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] rounded-xl p-6 space-y-4"
          >
            <div className="h-6 bg-muted-foreground/20 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted-foreground/20 rounded w-full" />
              <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
            </div>
          </motion.div>
        )
      case "input":
        return (
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] h-12 rounded-lg"
          />
        )
      case "button":
        return (
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] h-10 rounded-lg w-24"
          />
        )
      case "text":
        return (
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] h-4 rounded w-full"
          />
        )
      case "image":
        return (
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] h-48 rounded-lg"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}
