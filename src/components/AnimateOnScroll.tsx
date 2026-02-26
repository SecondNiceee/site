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
  up: "translateY(40px)",
  down: "translateY(-40px)",
  left: "translateX(-40px)",
  right: "translateX(40px)",
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
          // Force a style recalculation so the browser registers the initial
          // hidden state before we add .in-view and trigger the transition.
          void element.getBoundingClientRect();
          requestAnimationFrame(() => {
            setIsInView(true);
          });
          observer.unobserve(entry.target);
        }
      },
      { rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={callbackRef as any}
      className={cn(
        "animate-on-scroll",
        direction !== "up" && `dir-${direction}`,
        isInView && "in-view",
        className
      )}
      style={{
        transitionDelay: delay ? `${delay}s` : undefined,
        transitionDuration: duration !== 0.9 ? `${duration}s` : undefined,
        ...style,
      }}
      {...(onClick ? { onClick } : {})}
      {...(href && Tag === "a" ? { href } : {})}
    >
      {children}
    </Tag>
  );
}
