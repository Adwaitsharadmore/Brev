"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

import { cn } from "@/lib/utils"

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "right" | "middle"
}

export function Dock({ children, direction = "middle", ...props }: DockProps) {
  return (
    <div
      className={cn(
        "fixed flex h-16 gap-4 rounded-2xl bg-gray-50/80 p-4 shadow-xl backdrop-blur-md dark:bg-gray-900/80",
        direction === "left" && "left-4 bottom-4",
        direction === "right" && "right-4 bottom-4",
        direction === "middle" && "left-1/2 -translate-x-1/2 bottom-4"
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DockIcon({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const size = useSpring(48, { mass: 0.1, stiffness: 150, damping: 12 })
  const opacity = useSpring(1, { mass: 0.1, stiffness: 150, damping: 12 })

  const scale = useTransform(size, [48, 64], [1, 1.2])

  return (
    <motion.div
      style={{ scale }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        size.set(64)
        opacity.set(1)
      }}
      onMouseLeave={() => {
        size.set(48)
        opacity.set(1)
      }}
      className="relative flex items-center justify-center"
    >
      {children}
    </motion.div>
  )
} 