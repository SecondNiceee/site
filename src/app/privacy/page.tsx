"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Shield, Database, Lock, Eye, Mail, FileText, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

const iconMap: Record<string, typeof Shield> = {
  "Общие положения": Shield,
  "Сбор и использование информации": Database,
  "Защита персональных данных": Lock,
  "Передача данных третьим лицам": Eye,
  "Права пользователей": FileText,
  "Cookies и технологии отслеживания": CheckCircle,
  "Контакты и обратная связь": Mail,
};

export default function PrivacyPage() {
  const [sections, setSections] = useState<Array<{ title: string; content: string[] }>>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents?type=privacy");
        if (response.ok) {
          const data = await response.json();
          setSections(data.sections || []);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[oklch(0.75_0.18_50)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sectionsWithIcons = sections.map((section) => ({
    ...section,
    icon: iconMap[section.title] || Shield,
  }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.75_0.18_50)/5] via-transparent to-transparent" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div ref={heroRef} className="reveal fade-up max-w-4xl mx-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                На главную
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[oklch(0.75_0.18_50)] flex items-center justify-center">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-2">
                    Политика конфиденциальности
                  </h1>
                  <p className="text-muted-foreground">
                    Дата последнего обновления: {new Date().toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                <p className="text-muted-foreground leading-relaxed">
                  Мы серьёзно относимся к защите ваших персональных данных и соблюдаем все требования
                  законодательства Российской Федерации в области защиты персональных данных.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {sectionsWithIcons.map((section, index) => (
                <SectionCard key={section.title} section={section} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div ref={ctaRef} className="reveal fade-up max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-12">
              <h2 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase mb-6 text-center">
                Ваша конфиденциальность важна для нас
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)] flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Безопасность</h3>
                  <p className="text-sm text-muted-foreground">
                    Мы используем современные технологии защиты данных
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)] flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Прозрачность</h3>
                  <p className="text-sm text-muted-foreground">
                    Мы открыто рассказываем о том, как используем ваши данные
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Контроль</h3>
                  <p className="text-sm text-muted-foreground">
                    Вы всегда можете запросить доступ или удаление ваших данных
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Button
                  asChild
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold px-8 py-6"
                >
                  <Link href="/#contacts">
                    Связаться с нами
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SectionCard({ section, index }: { section: { title: string; content: string[]; icon: typeof Shield }; index: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal fade-up bg-card border border-border rounded-3xl p-8 md:p-10 hover:border-[oklch(0.75_0.18_50)/30] transition-all duration-300"
      style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
    >
      <div className="flex items-start gap-6 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)] flex items-center justify-center flex-shrink-0">
          <section.icon className="w-6 h-6 text-black" />
        </div>
        <div className="flex-1">
          <h2 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase mb-4">
            {index + 1}. {section.title}
          </h2>
          <div className="space-y-4">
            {section.content.map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className="text-muted-foreground leading-relaxed text-base md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
