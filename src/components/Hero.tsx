"use client";

import { Users, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/components/ThemeProvider";

const stats = [
  { icon: Users, value: "1000+", label: "Сотрудников в резерве" },
  { icon: Clock, value: "24/7", label: "Оперативный выход" },
  { icon: Shield, value: "100%", label: "Гарантия качества" },
];

export default function Hero() {
  const { settings } = useSettings();
  const { theme } = useTheme();

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
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in-scale"
          style={{
            backgroundImage: `url('/molodoi-master-stroit-dom.jpg')`,
          }}
        />
        {/* Gradient overlay */}
        {theme === "dark" && (
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-background animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          />
        )}

      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[oklch(0.75_0.18_50)/30] bg-[oklch(0.75_0.18_50)/10] text-sm text-[oklch(0.75_0.18_50)] mb-8 animate-fade-in-up"
          >
            <span className="w-2 h-2 rounded-full bg-[oklch(0.75_0.18_50)] animate-pulse" />
            Аутсорсинг рабочего персонала
          </div>

          {/* Main Heading */}
          <h1
            className="font-[var(--font-oswald)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-[0.95] tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {titleParts.length > 1 ? (
              <>
                <span className="block">{titleParts[0]},</span>
                <span className="block gradient-text">{titleParts[1]?.trim()}</span>
              </>
            ) : (
              <span className="block gradient-text">{settings.hero.title}</span>
            )}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            {settings.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              onClick={scrollToContacts}
              size="lg"
              className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold text-lg px-8 py-6 group"
            >
              Заказать персонал
              <span className="ml-2 inline-block animate-arrow-bounce">
                {"→"}
              </span>
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
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center p-6 rounded-2xl glass animate-fade-in-up"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <stat.icon className="w-8 h-8 text-[oklch(0.75_0.18_50)] mb-3" />
                <span className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
