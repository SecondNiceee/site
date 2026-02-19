"use client";

import { type ReactNode } from "react";
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
  const [ref, isInView] = useInView({ once: true, rootMargin });

  const directionStyles: Record<string, string> = {
    up: "translate-y-[30px]",
    down: "translate-y-[-30px]",
    left: "translate-x-[-30px]",
    right: "translate-x-[30px]",
    none: "",
  };

  const props: Record<string, unknown> = {
    ref,
    className: cn(
      "transition-all ease-out",
      !isInView && "opacity-0",
      !isInView && directionStyles[direction],
      isInView && "opacity-100 translate-x-0 translate-y-0",
      className
    ),
    style: {
      transitionDuration: `${duration}s`,
      transitionDelay: `${delay}s`,
      ...style,
    },
  };

  if (onClick) props.onClick = onClick;
  if (href && Tag === "a") props.href = href;

  return <Tag {...(props as React.ComponentProps<typeof Tag>)}>{children}</Tag>;
}
