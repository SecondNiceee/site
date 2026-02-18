"use client";

import { useState, useEffect, useRef } from "react";
import type { PortfolioItem } from "../_lib/types";

export function usePortfolio(isAuthenticated: boolean) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: "",
    description: "",
    image: "",
    category: "Строительство",
    client: "",
    duration: "",
    workers: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch("/api/admin/portfolio");
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolio();
    }
  }, [isAuthenticated]);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      category: "Строительство",
      client: "",
      duration: "",
      workers: 0,
    });
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData(item);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({
      title: "",
      description: "",
      image: "",
      category: "Строительство",
      client: "",
      duration: "",
      workers: 0,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `Неподдерживаемый тип файла: ${file.type}. Разрешены только JPEG, PNG, WebP и GIF.`;
      setUploadError(errorMsg);
      console.error(errorMsg);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = `Файл слишком большой: ${(file.size / 1024 / 1024).toFixed(2)}MB. Максимальный размер: 5MB.`;
      setUploadError(errorMsg);
      console.error(errorMsg);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, image: data.url }));
        setUploadError(null);
      } else {
        let errorMessage = "Ошибка загрузки файла";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        }
        setUploadError(errorMessage);
      }
    } catch (error) {
      const errorMessage = `Ошибка загрузки файла: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`;
      console.error(errorMessage, error);
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    try {
      const method = isCreating ? "POST" : "PUT";
      const body = isCreating
        ? { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() }
        : { ...formData, id: editingItem?.id };

      const response = await fetch("/api/admin/portfolio", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchPortfolio();
        handleCancel();
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот кейс?")) return;

    try {
      const response = await fetch("/api/admin/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return {
    items,
    editingItem,
    isCreating,
    formData,
    setFormData,
    uploading,
    uploadError,
    setUploadError,
    fileInputRef,
    handleCreate,
    handleEdit,
    handleCancel,
    handleFileUpload,
    handleSave,
    handleDelete,
  };
}
