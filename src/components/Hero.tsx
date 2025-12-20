"use client";

import { motion } from "framer-motion";
import { Users, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";

const stats = [
  { icon: Users, value: "1000+", label: "Сотрудников в резерве" },
  { icon: Clock, value: "24/7", label: "Оперативный выход" },
  { icon: Shield, value: "100%", label: "Гарантия качества" },
];

export default function Hero() {
  const { settings } = useSettings();

  const scrollToContacts = () => {
    const element = document.querySelector("#contacts");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Split title for styling
  const titleParts = settings.hero.title.split(",");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/molodoi-master-stroit-dom.jpg')`,
          }}
        />
        {/* Dark gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-background"
        />
        {/* Diagonal lines pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 11px
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[oklch(0.75_0.18_50)/30] bg-[oklch(0.75_0.18_50)/10] text-sm text-[oklch(0.75_0.18_50)] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[oklch(0.75_0.18_50)] animate-pulse" />
            Аутсорсинг рабочего персонала
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-[var(--font-oswald)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-[0.95] tracking-tight mb-6"
          >
            {titleParts.length > 1 ? (
              <>
                <span className="block">{titleParts[0]},</span>
                <span className="block gradient-text">{titleParts[1]?.trim()}</span>
              </>
            ) : (
              <span className="block gradient-text">{settings.hero.title}</span>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            {settings.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={scrollToContacts}
              size="lg"
              className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold text-lg px-8 py-6 group"
            >
              Заказать персонал
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 hover:bg-white/10 text-lg px-8 py-6"
              onClick={() => {
                const element = document.querySelector("#about");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Узнать больше
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="flex flex-col items-center p-6 rounded-2xl glass"
              >
                <stat.icon className="w-8 h-8 text-[oklch(0.75_0.18_50)] mb-3" />
                <span className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
