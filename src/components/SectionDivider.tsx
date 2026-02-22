"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "default" | "wave" | "angle";
}

export default function SectionDivider({ variant = "default" }: SectionDividerProps) {
  if (variant === "wave") {
    return (
      <div className="relative h-24 md:h-32 overflow-hidden bg-transparent -mt-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="oklch(0.08 0 0)"
          />
        </svg>
      </div>
    );
  }

  if (variant === "angle") {
    return (
      <div className="relative h-20 md:h-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-background" />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.75_0.18_50)/40] to-transparent origin-left"
        />
        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-background to-transparent" />
      </div>
    );
  }

  // Default divider
  return (
    <div className="relative py-12 md:py-16 overflow-hidden">
      {/* Center decorative element */}
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          {/* Left line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px bg-gradient-to-r from-transparent to-[oklch(0.75_0.18_50)/30] max-w-[200px]"
          />
          
          {/* Center icon */}
          <div className="relative">
            <div className="w-3 h-3 rotate-45 border-2 border-[oklch(0.75_0.18_50)/50] bg-background" />
            <div className="absolute inset-0 w-3 h-3 rotate-45 bg-[oklch(0.75_0.18_50)/20] animate-ping" />
          </div>
          
          {/* Right line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px bg-gradient-to-l from-transparent to-[oklch(0.75_0.18_50)/30] max-w-[200px]"
          />
        </motion.div>
      </div>
    </div>
  );
}

