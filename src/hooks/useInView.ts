"use client";

import { useRef, useState, useEffect, type RefObject } from "react";

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean, boolean] {
  const { threshold = 0, rootMargin = "-100px", once = true } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so the CSS transition is active before the observer fires,
    // preventing the element from immediately appearing without animation.
    const mountTimer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [mounted, threshold, rootMargin, once]);

  return [ref, isInView, mounted];
}
