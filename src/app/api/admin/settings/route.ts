import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

interface SiteSettings {
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

const defaultSettings: SiteSettings = {
  company: {
    name: "Тяжёлый Профиль",
    description: "",
    slogan: "",
  },
  contacts: {
    phone: "",
    email: "",
    address: "",
  },
  social: {
    telegram: "",
    whatsapp: "",
    vk: "",
    instagram: "",
  },
  hero: {
    title: "",
    subtitle: "",
  },
  meta: {
    title: "",
    description: "",
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

// GET - Получить настройки
export async function GET() {
  try {
    const { rows } = await pool.query("SELECT data FROM settings LIMIT 1");

    if (rows.length === 0) {
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(rows[0].data || defaultSettings);
  } catch (error) {
    console.error("Error reading settings:", error);
    return NextResponse.json(defaultSettings);
  }
}

// PUT - Обновить настройки
export async function PUT(request: NextRequest) {
  try {
    const updatedSettings: SiteSettings = await request.json();

    // Проверяем, есть ли уже запись
    const { rows: existing } = await pool.query("SELECT id FROM settings LIMIT 1");

    if (existing.length > 0) {
      await pool.query("UPDATE settings SET data = $1 WHERE id = $2", [
        JSON.stringify(updatedSettings),
        existing[0].id,
      ]);
    } else {
      await pool.query("INSERT INTO settings (data) VALUES ($1)", [
        JSON.stringify(updatedSettings),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
