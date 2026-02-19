import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET - Получить все вопросы
export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM faq ORDER BY order_index ASC"
    );

    const items = rows.map((item) => ({
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
    const newItem = await request.json();

    const { rows } = await pool.query(
      `INSERT INTO faq (id, question, answer, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [newItem.id, newItem.question, newItem.answer, newItem.order_index || 0]
    );

    return NextResponse.json({
      success: true,
      item: {
        ...rows[0],
        createdAt: rows[0].created_at,
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
    const updatedItem = await request.json();

    const { rows } = await pool.query(
      `UPDATE faq
       SET question = $1, answer = $2, order_index = $3
       WHERE id = $4
       RETURNING *`,
      [updatedItem.question, updatedItem.answer, updatedItem.order_index || 0, updatedItem.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item: {
        ...rows[0],
        createdAt: rows[0].created_at,
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
    const { id } = await request.json();

    await pool.query("DELETE FROM faq WHERE id = $1", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
