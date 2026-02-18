"use client";

import { useState, useEffect } from "react";
import type { FaqItem } from "../_lib/types";

export function useFaq(isAuthenticated: boolean) {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isCreatingFaq, setIsCreatingFaq] = useState(false);
  const [faqFormData, setFaqFormData] = useState({ question: "", answer: "", order_index: 0 });

  const fetchFAQ = async () => {
    try {
      const response = await fetch("/api/admin/faq");
      if (response.ok) {
        const data = await response.json();
        setFaqItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFAQ();
    }
  }, [isAuthenticated]);

  const handleEditFaq = (item: FaqItem) => {
    setEditingFaq(item);
    setIsCreatingFaq(false);
    setFaqFormData({ question: item.question, answer: item.answer, order_index: item.order_index || 0 });
  };

  const handleCreateFaq = () => {
    setEditingFaq(null);
    setIsCreatingFaq(true);
    setFaqFormData({ question: "", answer: "", order_index: faqItems.length });
  };

  const handleCancelFaq = () => {
    setEditingFaq(null);
    setIsCreatingFaq(false);
    setFaqFormData({ question: "", answer: "", order_index: 0 });
  };

  const handleSaveFaq = async () => {
    try {
      const method = isCreatingFaq ? "POST" : "PUT";
      const body = isCreatingFaq
        ? { ...faqFormData, id: Date.now().toString() }
        : { ...faqFormData, id: editingFaq?.id };

      const response = await fetch("/api/admin/faq", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchFAQ();
        handleCancelFaq();
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Удалить этот вопрос?")) return;

    try {
      const response = await fetch("/api/admin/faq", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchFAQ();
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  return {
    faqItems,
    editingFaq,
    isCreatingFaq,
    faqFormData,
    setFaqFormData,
    handleEditFaq,
    handleCreateFaq,
    handleCancelFaq,
    handleSaveFaq,
    handleDeleteFaq,
  };
}
