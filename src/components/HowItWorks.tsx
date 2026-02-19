"use client";

import { Phone, FileText, Users, CheckCircle } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Phone,
    number: "01",
    title: "Оставьте заявку",
    description:
      "Свяжитесь с нами и расскажите о вашем проекте и потребностях в персонале.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Согласование деталей",
    description:
      "Мы уточним требования к специалистам, сроки, объём работ и другие важные детали для точного подбора персонала.",
  },
  {
    icon: Users,
    number: "03",
    title: "Подбор команды",
    description:
      "Формируем команду из проверенных специалистов с опытом в нужной сфере.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Выход на объект",
    description:
      "Команда выходит в назначенный срок, полностью готовая к работе. Мы контролируем качество на всех этапах.",
  },
];

export default function HowItWorks() {
  const [ref, isInView] = useInView({ once: true, rootMargin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden bg-secondary/30">
      {/* Decorative grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.75 0.18 50 / 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.75 0.18 50 / 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Orange accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[oklch(0.75_0.18_50)/8] dark:bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <AnimateOnScroll
            as="span"
            className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Процесс работы
          </AnimateOnScroll>
          <AnimateOnScroll
            as="h2"
            delay={0.1}
            className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
          >
            Как начать <span className="gradient-text">работать?</span>
          </AnimateOnScroll>
          <AnimateOnScroll
            as="p"
            delay={0.2}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Простой и прозрачный процесс от заявки до результата
          </AnimateOnScroll>
        </div>

        {/* Timeline */}
        <div ref={ref} className="relative">
          {/* Timeline line - desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[oklch(0.75_0.18_50)/30] to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={cn(
                  "relative group",
                  "opacity-0 translate-y-[30px]",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{
                  transitionProperty: "opacity, transform",
                  transitionDuration: "0.5s",
                  transitionTimingFunction: "ease-out",
                  transitionDelay: isInView ? `${index * 0.2}s` : "0s",
                }}
              >
                {/* Connector line - mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-[oklch(0.75_0.18_50)/30] to-transparent translate-y-4" />
                )}

                {/* Card */}
                <div className="relative p-6 md:p-8 rounded-3xl bg-card border border-border hover:border-[oklch(0.75_0.18_50)/30] transition-all duration-500 h-full shadow-sm hover:shadow-lg dark:shadow-none">
                  {/* Step number */}
                  <div className="relative z-10 flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[oklch(0.75_0.18_50)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[oklch(0.75_0.18_50)/20]">
                        <step.icon className="w-6 h-6 text-black" />
                      </div>
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 rounded-full bg-[oklch(0.75_0.18_50)/20] scale-125 blur-sm" />
                    </div>
                    <span className="font-[var(--font-oswald)] text-5xl font-bold text-foreground/5 group-hover:text-[oklch(0.75_0.18_50)/20] transition-colors duration-500">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase mb-3 group-hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector - desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-24 -right-4 z-20 w-8 h-8 items-center justify-center">
                    <div className="w-3 h-3 border-t-2 border-r-2 border-[oklch(0.75_0.18_50)/50] rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <AnimateOnScroll delay={0.6} className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Готовы обсудить ваш проект?
          </p>
          <a
            href="#contacts"
            className="inline-flex items-center gap-2 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold px-8 py-4 rounded-full transition-colors duration-300 shadow-lg shadow-[oklch(0.75_0.18_50)/20] hover-scale-subtle"
          >
            Оставить заявку
            <span>{"→"}</span>
          </a>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
