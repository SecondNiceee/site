"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-reveal hook using a single shared IntersectionObserver.
 * Replaces framer-motion whileInView for much better performance.
 * 
 * Usage:
 *   const ref = useReveal<HTMLDivElement>();
 *   <div ref={ref} className="reveal fade-up">...</div>
 */

let observer: IntersectionObserver | null = null;
const observedElements = new Set<Element>();

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
            observedElements.delete(entry.target);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-40px 0px",
      }
    );
  }
  return observer;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = getObserver();
    obs.observe(el);
    observedElements.add(el);

    return () => {
      obs.unobserve(el);
      observedElements.delete(el);
    };
  }, []);

  return ref;
}

/**
 * Hook to observe multiple children of a container for staggered reveal.
 * Applies .is-visible with incrementing --reveal-delay to each child.
 */
export function useRevealChildren<T extends HTMLElement>(staggerMs = 80) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll(".reveal");
    if (children.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Find the index of this child in the container
            const idx = Array.from(children).indexOf(entry.target);
            (entry.target as HTMLElement).style.setProperty(
              "--reveal-delay",
              `${idx * staggerMs}ms`
            );
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: "-20px 0px",
      }
    );

    children.forEach((child) => obs.observe(child));

    return () => {
      children.forEach((child) => obs.unobserve(child));
    };
  }, [staggerMs]);

  return ref;
}
