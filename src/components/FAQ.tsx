"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order_index?: number;
}

export default function FAQ() {
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await fetch("/api/admin/faq");
        if (response.ok) {
          const data = await response.json();
          setFaqData(data.items || []);
        }
      } catch (error) {
        console.error("Error fetching FAQ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQ();
  }, []);

  if (isLoading) {
    return (
      <section id="faq" className="py-24 md:py-32 relative overflow-hidden bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-[oklch(0.75_0.18_50)] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden bg-card/50">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Вопросы и ответы
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
            >
              Частые <span className="gradient-text">вопросы</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg mb-8"
            >
              Ответы на популярные вопросы о нашей работе. Не нашли ответ?
              Свяжитесь с нами!
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              href="#contacts"
              className="inline-flex items-center gap-2 text-[oklch(0.75_0.18_50)] hover:text-[oklch(0.85_0.18_50)] font-medium transition-colors"
            >
              Задать вопрос
              <span>→</span>
            </motion.a>
          </div>

          {/* Right Column - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.length > 0 ? (
                faqData.map((item, index) => (
                  <AccordionItem
                    key={item.id}
                    value={`item-${item.id}`}
                    className="bg-background/50 border border-border rounded-2xl px-6 data-[state=open]:border-[oklch(0.75_0.18_50)/30] transition-colors duration-300"
                  >
                    <AccordionTrigger className="text-left font-medium hover:text-[oklch(0.75_0.18_50)] transition-colors py-5 [&[data-state=open]]:text-[oklch(0.75_0.18_50)]">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Вопросы и ответы пока не добавлены
                </p>
              )}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

