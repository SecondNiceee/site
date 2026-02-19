"use client";

import { useRef } from "react";
import { Users, Zap, Shield, Clock, Award, HeartHandshake } from "lucide-react";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const features = [
  {
    icon: Users,
    title: "Проверенные сотрудники",
    description:
      "Подбираем не случайных людей, а рабочий персонал, который умеет работать в темпе, соблюдает технику безопасности и выполняет задачи без лишних вопросов.",
  },
  {
    icon: Shield,
    title: "Полная подготовка",
    description:
      "Все сотрудники проходят инструктаж и выходят на смены полностью подготовленными — без срывов, опозданий и простоев.",
  },
  {
    icon: Zap,
    title: "Точный подбор",
    description:
      "Строительные объекты, склады, монтажные и промышленные работы — мы точно понимаем, какие специалисты нужны под каждую задачу.",
  },
  {
    icon: Clock,
    title: "Резерв 1000+ человек",
    description:
      "В непредвиденных ситуациях у нас есть резерв из более чем 1000 сотрудников, готовых оперативно выйти на объект.",
  },
  {
    icon: Award,
    title: "Как свой объект",
    description:
      "Мы работаем так, будто каждый объект — наш собственный: дисциплина, ответственность и контроль качества.",
  },
  {
    icon: HeartHandshake,
    title: "Надёжное партнёрство",
    description:
      "Тяжёлый профиль — когда нужен рабочий персонал, на который действительно можно положиться.",
  },
];

export default function About() {
  const titleRef = useReveal<HTMLDivElement>();
  const featuresRef = useRevealChildren<HTMLDivElement>(80);

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden bg-card/50">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div ref={titleRef} className="reveal fade-up">
            <span className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4">
              О компании
            </span>
            <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6">
              Почему выбирают
              <br />
              <span className="gradient-text">Тяжёлый Профиль</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Мы не просто предоставляем рабочий персонал — мы берём на себя
              ответственность за результат. Каждый сотрудник проверен, обучен
              и готов к работе.
            </p>
          </div>

          {/* Right Column - Features */}
          <div ref={featuresRef} className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="reveal fade-left group flex gap-4 p-5 rounded-2xl bg-background/50 border border-transparent hover:border-[oklch(0.75_0.18_50)/20] transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)/10] flex items-center justify-center group-hover:bg-[oklch(0.75_0.18_50)/20] transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
