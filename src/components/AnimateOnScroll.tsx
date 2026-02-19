"use client";

import { useCallback, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
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

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.6,
  as: Tag = "div",
  rootMargin = "-80px",
  style,
  onClick,
  href,
}: AnimateOnScrollProps) {
  const [observerRef, isInView] = useInView({ once: true, rootMargin });

  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      (observerRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [observerRef]
  );

  const directionStyles: Record<string, string> = {
    up: "translate-y-[30px]",
    down: "translate-y-[-30px]",
    left: "translate-x-[-30px]",
    right: "translate-x-[30px]",
    none: "",
  };

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={callbackRef as any}
      className={cn(
        "transition-all ease-out",
        !isInView && "opacity-0",
        !isInView && directionStyles[direction],
        isInView && "opacity-100 translate-x-0 translate-y-0",
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        ...style,
      }}
      {...(onClick ? { onClick } : {})}
      {...(href && Tag === "a" ? { href } : {})}
    >
      {children}
    </Tag>
  );
}
