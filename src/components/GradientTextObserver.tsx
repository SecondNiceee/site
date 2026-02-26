"use client";

import { useEffect } from "react";

/**
 * Паузит анимацию gradient-shift на элементах вне viewport.
 * Вешает IntersectionObserver на все .gradient-text и добавляет/убирает
 * класс gradient-text--visible для управления animation-play-state.
 */
export default function GradientTextObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".gradient-text");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle(
            "gradient-text--visible",
            entry.isIntersecting
          );
        }
      },
      { rootMargin: "0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
