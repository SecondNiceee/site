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

  // Update section content as a single text block (split by double newlines into paragraphs)
  const updateDocumentSectionText = (
    docType: "privacy" | "offer",
    sectionIndex: number,
    fullText: string
  ) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    // Split by double newline into paragraphs, preserve single newlines within a paragraph
    const paragraphs = fullText
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    newDocuments[docType].sections[sectionIndex].content =
      paragraphs.length > 0 ? paragraphs : [""];
    setDocuments(newDocuments);
  };

  // Convert section content array back to a single text string
  const getSectionText = (
    docType: "privacy" | "offer",
    sectionIndex: number
  ): string => {
    if (!documents) return "";
    const section = documents[docType].sections[sectionIndex];
    if (!section) return "";
    return section.content.join("\n\n");
  };

  const addDocumentSection = (docType: "privacy" | "offer") => {
    if (!documents) return;
    const newDocuments = { ...documents };
    newDocuments[docType].sections.push({ title: "", content: [""] });
    setDocuments(newDocuments);
  };

  const removeDocumentSection = (
    docType: "privacy" | "offer",
    sectionIndex: number
  ) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    newDocuments[docType].sections.splice(sectionIndex, 1);
    setDocuments(newDocuments);
  };

  return {
    documents,
    savingDocuments,
    handleSaveDocuments,
    updateDocumentSection,
    updateDocumentSectionText,
    getSectionText,
    addDocumentSection,
    removeDocumentSection,
  };
}
