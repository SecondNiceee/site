"use client";

import { useState, useEffect } from "react";
import type { Documents } from "../_lib/types";

export function useDocuments(isAuthenticated: boolean) {
  const [documents, setDocuments] = useState<Documents | null>(null);
  const [savingDocuments, setSavingDocuments] = useState(false);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/admin/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated]);

  const handleSaveDocuments = async () => {
    if (!documents) return;

    setSavingDocuments(true);
    try {
      const response = await fetch("/api/admin/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documents),
      });

      if (response.ok) {
        alert("Документы сохранены!");
      } else {
        alert("Ошибка сохранения документов");
      }
    } catch (error) {
      console.error("Error saving documents:", error);
      alert("Ошибка сохранения документов");
    } finally {
      setSavingDocuments(false);
    }
  };

  const updateDocumentSection = (
    docType: "privacy" | "offer",
    sectionIndex: number,
    field: "title" | "content",
    value: string | string[]
  ) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    if (field === "title") {
      newDocuments[docType].sections[sectionIndex].title = value as string;
    } else {
      newDocuments[docType].sections[sectionIndex].content = value as string[];
    }
    setDocuments(newDocuments);
  };

  const updateDocumentParagraph = (
    docType: "privacy" | "offer",
    sectionIndex: number,
    paragraphIndex: number,
    value: string
  ) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    newDocuments[docType].sections[sectionIndex].content[paragraphIndex] = value;
    setDocuments(newDocuments);
  };

  const addDocumentParagraph = (docType: "privacy" | "offer", sectionIndex: number) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    newDocuments[docType].sections[sectionIndex].content.push("");
    setDocuments(newDocuments);
  };

  const removeDocumentParagraph = (docType: "privacy" | "offer", sectionIndex: number, paragraphIndex: number) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    newDocuments[docType].sections[sectionIndex].content.splice(paragraphIndex, 1);
    setDocuments(newDocuments);
  };

  return {
    documents,
    savingDocuments,
    handleSaveDocuments,
    updateDocumentSection,
    updateDocumentParagraph,
    addDocumentParagraph,
    removeDocumentParagraph,
  };
}
