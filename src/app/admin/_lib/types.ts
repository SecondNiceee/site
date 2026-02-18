export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  client: string;
  duration: string;
  workers: number;
  createdAt: string;
}

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

export interface DocumentSection {
  title: string;
  content: string[];
}

export interface Documents {
  privacy: { sections: DocumentSection[] };
  offer: { sections: DocumentSection[] };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order_index?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order_index?: number;
}

export type AdminTab = "portfolio" | "settings" | "documents" | "security" | "blocks" | "faq" | "services";

export const categories = ["Строительство", "Склад", "Промышленность", "Монтаж"];
