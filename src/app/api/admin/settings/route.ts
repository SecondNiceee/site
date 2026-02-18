import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

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

// GET - Получить настройки
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("data")
      .limit(1)
      .single();

    if (error) {
      console.error("Error reading settings:", error);
      // Возвращаем настройки по умолчанию, если их нет в БД
      return NextResponse.json({
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
      } as SiteSettings);
    }

    return NextResponse.json(data?.data || {});
  } catch (error) {
    console.error("Error reading settings:", error);
    return NextResponse.json(
      { error: "Failed to read settings" },
      { status: 500 }
    );
  }
}

// PUT - Обновить настройки
export async function PUT(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const updatedSettings: SiteSettings = await request.json();

    // Проверяем, есть ли уже запись
    const { data: existing } = await supabaseAdmin
      .from("settings")
      .select("id")
      .limit(1)
      .single();

    if (existing) {
      // Обновляем существующую запись
      const { error } = await supabaseAdmin
        .from("settings")
        .update({ data: updatedSettings })
        .eq("id", existing.id);

      if (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
          { error: "Failed to update settings" },
          { status: 500 }
        );
      }
    } else {
      // Создаём новую запись
      const { error } = await supabaseAdmin
        .from("settings")
        .insert({ data: updatedSettings });

      if (error) {
        console.error("Error creating settings:", error);
        return NextResponse.json(
          { error: "Failed to create settings" },
          { status: 500 }
        );
      }
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

