"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  as?: "div" | "span" | "p" | "h2" | "a" | "section";
  rootMargin?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
}

const directionMap: Record<string, string> = {
  up: "translateY(24px)",
  down: "translateY(-24px)",
  left: "translateX(-24px)",
  right: "translateX(24px)",
  none: "none",
};

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.9,
  as: Tag = "div",
  rootMargin = "-60px",
  style,
  onClick,
  href,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const callbackRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  const initialTransform =
    direction === "none" ? "none" : directionMap[direction];

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={callbackRef as any}
      className={cn(className)}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : initialTransform,
        transition: `opacity ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s`,
        willChange: isInView ? "auto" : "opacity, transform",
        ...style,
      }}
      {...(onClick ? { onClick } : {})}
      {...(href && Tag === "a" ? { href } : {})}
    >
      {children}
    </Tag>
  );
}
