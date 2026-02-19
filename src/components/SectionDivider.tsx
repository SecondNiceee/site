"use client";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "default" | "wave" | "angle";
}

export default function SectionDivider({ variant = "default" }: SectionDividerProps) {
  const [ref, isInView] = useInView({ once: true, rootMargin: "0px" });

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
      <div ref={ref} className="relative h-20 md:h-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-background" />
        <div
          className={cn(
            "absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.75_0.18_50)/40] to-transparent origin-left transition-transform duration-1000 ease-out",
            isInView ? "scale-x-100" : "scale-x-0"
          )}
        />
        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-background to-transparent" />
      </div>
    );
  }

  // Default divider
  return (
    <div ref={ref} className="relative py-12 md:py-16 overflow-hidden">
      {/* Center decorative element */}
      <div className="container mx-auto px-4 relative">
        <div
          className={cn(
            "flex items-center justify-center gap-4 transition-all duration-600 ease-out",
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-[0.8]"
          )}
          style={{ transitionDuration: "0.6s" }}
        >
          {/* Left line */}
          <div
            className={cn(
              "h-px bg-gradient-to-r from-transparent to-[oklch(0.75_0.18_50)/30] max-w-[200px] transition-all duration-800 ease-out",
              isInView ? "w-full" : "w-0"
            )}
            style={{ transitionDuration: "0.8s", transitionDelay: "0.2s" }}
          />
          
          {/* Center icon */}
          <div className="relative">
            <div className="w-3 h-3 rotate-45 border-2 border-[oklch(0.75_0.18_50)/50] bg-background" />
            <div className="absolute inset-0 w-3 h-3 rotate-45 bg-[oklch(0.75_0.18_50)/20] animate-ping" />
          </div>
          
          {/* Right line */}
          <div
            className={cn(
              "h-px bg-gradient-to-l from-transparent to-[oklch(0.75_0.18_50)/30] max-w-[200px] transition-all duration-800 ease-out",
              isInView ? "w-full" : "w-0"
            )}
            style={{ transitionDuration: "0.8s", transitionDelay: "0.2s" }}
          />
        </div>
      </div>
    </div>
  );
}
