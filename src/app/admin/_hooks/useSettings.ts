"use client";

import { useState, useEffect, useRef } from "react";
import type { SiteSettings } from "../_lib/types";

export function useSettings(isAuthenticated: boolean) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        if (!data.logo) {
          data.logo = { url: "", enabled: true };
        }
        if (!data.form) {
          data.form = { enabled: true };
        }
        if (!data.workingHours) {
          data.workingHours = { enabled: true };
        }
        if (!data.visibility) {
          data.visibility = { address: true, documents: true };
        }
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const updateSettings = (section: keyof SiteSettings, field: string, value: string | boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setSavingSettings(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Настройки сохранены!");
      } else {
        alert("Ошибка сохранения настроек");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Ошибка сохранения настроек");
    } finally {
      setSavingSettings(false);
    }
  };

  const toggleBlock = (blockName: keyof SiteSettings["blocks"]) => {
    if (!settings) return;
    setSettings({
      ...settings,
      blocks: {
        ...settings.blocks,
        [blockName]: !settings.blocks[blockName],
      },
    });
  };

  const handleSaveBlocks = async () => {
    if (!settings) return;

    setSavingSettings(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Настройки блоков сохранены!");
      } else {
        alert("Ошибка сохранения настроек блоков");
      }
    } catch (error) {
      console.error("Error saving blocks:", error);
      alert("Ошибка сохранения настроек блоков");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploadError(null);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `Неподдерживаемый тип файла: ${file.type}. Разрешены только JPEG, PNG, WebP, GIF и SVG.`;
      setLogoUploadError(errorMsg);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = `Файл слишком большой: ${(file.size / 1024 / 1024).toFixed(2)}MB. Максимальный размер: 5MB.`;
      setLogoUploadError(errorMsg);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
      return;
    }

    setUploadingLogo(true);
    setLogoUploadError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        updateSettings("logo", "url", data.url);
        setLogoUploadError(null);
      } else {
        let errorMessage = "Ошибка загрузки логотипа";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        }
        setLogoUploadError(errorMessage);
      }
    } catch (error) {
      const errorMessage = `Ошибка загрузки логотипа: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`;
      console.error(errorMessage, error);
      setLogoUploadError(errorMessage);
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

  return {
    settings,
    savingSettings,
    uploadingLogo,
    logoUploadError,
    setLogoUploadError,
    logoInputRef,
    updateSettings,
    handleSaveSettings,
    toggleBlock,
    handleSaveBlocks,
    handleLogoUpload,
  };
}
