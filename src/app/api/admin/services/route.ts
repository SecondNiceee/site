import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order_index?: number;
  createdAt?: string;
}

// GET - Получить все услуги
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error reading services:", error);
      // Если таблица не существует, возвращаем пустой массив вместо ошибки
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.log("Services table does not exist yet. Please run the SQL migration.");
        return NextResponse.json({ items: [] });
      }
      return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
    }

    const items = (data || []).map((item) => {
      // Обработка features - может быть массивом или JSONB строкой
      let features: string[] = [];
      if (Array.isArray(item.features)) {
        features = item.features;
      } else if (typeof item.features === 'string') {
        try {
          features = JSON.parse(item.features);
        } catch {
          features = [];
        }
      } else if (item.features) {
        features = item.features;
      }

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        icon: item.icon,
        features: features,
        order_index: item.order_index || 0,
        createdAt: item.created_at || new Date().toISOString(),
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error reading services:", error);
    // Возвращаем пустой массив вместо ошибки, чтобы компонент мог показать fallback
    return NextResponse.json({ items: [] });
  }
}

// POST - Создать новую услугу
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const newItem: ServiceItem = await request.json();

    const { data, error } = await supabaseAdmin
      .from("services")
      .insert({
        id: newItem.id,
        title: newItem.title,
        description: newItem.description,
        icon: newItem.icon,
        features: newItem.features || [],
        order_index: newItem.order_index || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating service item:", error);
      return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      item: {
        ...data,
        features: data.features || [],
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating service item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

// PUT - Обновить услугу
export async function PUT(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const updatedItem: ServiceItem = await request.json();

    const { data, error } = await supabaseAdmin
      .from("services")
      .update({
        title: updatedItem.title,
        description: updatedItem.description,
        icon: updatedItem.icon,
        features: updatedItem.features || [],
        order_index: updatedItem.order_index || 0,
      })
      .eq("id", updatedItem.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating service item:", error);
      return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item: {
        ...data,
        features: data.features || [],
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error updating service item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE - Удалить услугу
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const { id } = await request.json();

    const { error } = await supabaseAdmin
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting service item:", error);
      return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

