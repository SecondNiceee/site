"use client";

import { useState, useEffect } from "react";

export interface SiteSettings {
  company: {
    name: string;
    description: string;
    slogan: string;
  };
  contacts: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    telegram: string;
    whatsapp: string;
    vk: string;
    instagram: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  meta: {
    title: string;
    description: string;
  };
  logo: {
    url: string;
    enabled: boolean;
  };
  form: {
    enabled: boolean;
  };
  workingHours: {
    enabled: boolean;
    weekdays: string;
    weekends: string;
    note: string;
  };
  visibility: {
    address: boolean;
    documents: boolean;
  };
  blocks: {
    hero: boolean;
    services: boolean;
    about: boolean;
    portfolio: boolean;
    howItWorks: boolean;
    faq: boolean;
    contacts: boolean;
  };
}

const defaultSettings: SiteSettings = {
  company: {
    name: "Тяжёлый Профиль",
    description: "Профессиональный аутсорсинг рабочего персонала",
    slogan: "Рабочий персонал, на который можно положиться",
  },
  contacts: {
    phone: "+7 900 123-45-67",
    email: "info@tyazhprofil.ru",
    address: "Москва, ул. Примерная, 123",
  },
  social: {
    telegram: "https://t.me/tyazhprofil",
    whatsapp: "https://wa.me/79001234567",
    vk: "",
    instagram: "",
  },
  hero: {
    title: "Рабочий персонал, на который можно положиться",
    subtitle: "Строительные объекты, склады, монтажные и промышленные работы — профессиональные специалисты без срывов, опозданий и простоев",
  },
  meta: {
    title: "Тяжёлый Профиль — Аутсорсинг рабочего персонала",
    description: "Профессиональный аутсорсинг рабочего персонала",
  },
  logo: {
    url: "",
    enabled: true,
  },
  form: {
    enabled: true,
  },
  workingHours: {
    enabled: true,
    weekdays: "Пн-Пт: 9:00 — 20:00",
    weekends: "Сб-Вс: 10:00 — 18:00",
    note: "Срочные заявки — круглосуточно",
  },
  visibility: {
    address: true,
    documents: true,
  },
  blocks: {
    hero: true,
    services: true,
    about: true,
    portfolio: true,
    howItWorks: true,
    faq: true,
    contacts: true,
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, isLoading };
}

