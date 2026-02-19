"use client";

import { useState, useEffect } from "react";
import { Edit, X, Save } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order_index?: number;
}

export default function FAQ() {
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [editForm, setEditForm] = useState({ question: "", answer: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Проверяем авторизацию
    const authStatus = sessionStorage.getItem("admin_authenticated");
    setIsAuthenticated(authStatus === "true");

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

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    setEditForm({ question: item.question, answer: item.answer });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          question: editForm.question,
          answer: editForm.answer,
        }),
      });

      if (response.ok) {
        setFaqData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? { ...item, question: editForm.question, answer: editForm.answer }
              : item
          )
        );
        setEditingItem(null);
        setEditForm({ question: "", answer: "" });
      } else {
        alert("Ошибка при сохранении");
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert("Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditForm({ question: "", answer: "" });
  };

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
            <AnimateOnScroll
              as="span"
              className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Вопросы и ответы
            </AnimateOnScroll>
            <AnimateOnScroll
              as="h2"
              delay={0.1}
              className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
            >
              Частые <span className="gradient-text">вопросы</span>
            </AnimateOnScroll>
            <AnimateOnScroll
              as="p"
              delay={0.2}
              className="text-muted-foreground text-lg mb-8"
            >
              Ответы на популярные вопросы о нашей работе. Не нашли ответ?
              Свяжитесь с нами!
            </AnimateOnScroll>
            <AnimateOnScroll
              as="a"
              delay={0.3}
              href="#contacts"
              className="inline-flex items-center gap-2 text-[oklch(0.75_0.18_50)] hover:text-[oklch(0.85_0.18_50)] font-medium transition-colors"
            >
              Задать вопрос
              <span>{"→"}</span>
            </AnimateOnScroll>
          </div>

          {/* Right Column - Accordion */}
          <AnimateOnScroll delay={0}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.length > 0 ? (
                faqData.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={`item-${item.id}`}
                    className="bg-background/50 border border-border rounded-2xl px-6 data-[state=open]:border-[oklch(0.75_0.18_50)/30] transition-colors duration-300 relative group"
                  >
                    {isAuthenticated && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[oklch(0.75_0.18_50)/10]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <AccordionTrigger className="text-left font-medium hover:text-[oklch(0.75_0.18_50)] transition-colors py-5 [&[data-state=open]]:text-[oklch(0.75_0.18_50)] pr-10">
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
          </AnimateOnScroll>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={handleCancel}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full mx-4 animate-fade-in-up"
            style={{ animationDuration: "0.3s" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase">
                Редактирование вопроса
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Вопрос
                </label>
                <Input
                  value={editForm.question}
                  onChange={(e) =>
                    setEditForm({ ...editForm, question: e.target.value })
                  }
                  className="bg-background border-border"
                  placeholder="Введите вопрос"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ответ
                </label>
                <Textarea
                  value={editForm.answer}
                  onChange={(e) =>
                    setEditForm({ ...editForm, answer: e.target.value })
                  }
                  rows={6}
                  className="bg-background border-border"
                  placeholder="Введите ответ"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                disabled={isSaving || !editForm.question || !editForm.answer}
                className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
