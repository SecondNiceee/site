"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, FileText, CheckCircle, Shield, DollarSign, Users, Building2, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

const iconMap: Record<string, typeof FileText> = {
  "Общие положения": FileText,
  "Предмет договора": Users,
  "Порядок оказания услуг": CheckCircle,
  "Стоимость и оплата": DollarSign,
  "Гарантии и ответственность": Shield,
  "Реквизиты и контакты": Building2,
};

export default function OfferPage() {
  const [sections, setSections] = useState<Array<{ title: string; content: string[] }>>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents?type=offer");
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
    icon: iconMap[section.title] || FileText,
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
                  <FileText className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-2">
                    Договор публичной оферты
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
                  Настоящий документ определяет условия оказания услуг по аутсорсингу рабочего персонала.
                  Пожалуйста, внимательно ознакомьтесь с условиями перед использованием наших услуг.
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
                <OfferSectionCard key={section.title} section={section} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div ref={ctaRef} className="reveal fade-up max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-12 text-center">
              <h2 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase mb-4">
                Готовы начать сотрудничество?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Свяжитесь с нами для обсуждения деталей и получения персонального предложения
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold px-8 py-6"
                >
                  <Link href="/#contacts">
                    <Phone className="w-5 h-5 mr-2" />
                    Связаться с нами
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="px-8 py-6"
                >
                  <Link href="/">
                    Вернуться на главную
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

function OfferSectionCard({ section, index }: { section: { title: string; content: string[]; icon: typeof FileText }; index: number }) {
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
