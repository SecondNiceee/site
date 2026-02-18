import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order_index?: number;
  createdAt?: string;
}

// GET - Получить все вопросы
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error reading FAQ:", error);
      return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
    }

    const items = (data || []).map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      order_index: item.order_index || 0,
      createdAt: item.created_at || new Date().toISOString(),
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error reading FAQ:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

// POST - Создать новый вопрос
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const newItem: FAQItem = await request.json();

    const { data, error } = await supabaseAdmin
      .from("faq")
      .insert({
        id: newItem.id,
        question: newItem.question,
        answer: newItem.answer,
        order_index: newItem.order_index || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating FAQ item:", error);
      return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      item: {
        ...data,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating FAQ item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

// PUT - Обновить вопрос
export async function PUT(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const updatedItem: FAQItem = await request.json();

    const { data, error } = await supabaseAdmin
      .from("faq")
      .update({
        question: updatedItem.question,
        answer: updatedItem.answer,
        order_index: updatedItem.order_index || 0,
      })
      .eq("id", updatedItem.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating FAQ item:", error);
      return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item: {
        ...data,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error updating FAQ item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE - Удалить вопрос
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
      .from("faq")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting FAQ item:", error);
      return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}





