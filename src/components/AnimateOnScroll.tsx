"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  as?: "div" | "span" | "p" | "h2" | "a" | "section";
  rootMargin?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
}

const directionClass: Record<string, string> = {
  up: "aos-up",
  down: "aos-down",
  left: "aos-left",
  right: "aos-right",
  none: "aos-none",
};

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  as: Tag = "div",
  rootMargin = "-60px",
  style,
  onClick,
  href,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Direct DOM class manipulation — no React re-render,
          // so the browser's transition engine fires cleanly.
          el.classList.add("aos-in-view");
          observer.unobserve(el);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn("aos-base", directionClass[direction], className)}
      style={{
        transitionDelay: delay ? `${delay}s` : undefined,
        ...style,
      }}
      {...(onClick ? { onClick } : {})}
      {...(href && Tag === "a" ? { href } : {})}
    >
      {children}
    </Tag>
  );
}
