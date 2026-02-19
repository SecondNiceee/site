import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET - Получить все кейсы
export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM portfolio ORDER BY created_at DESC"
    );

    const items = rows.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      client: item.client,
      duration: item.duration,
      workers: item.workers,
      createdAt: item.created_at || new Date().toISOString(),
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error reading portfolio:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

// POST - Создать новый кейс
export async function POST(request: NextRequest) {
  try {
    const newItem = await request.json();

    const { rows } = await pool.query(
      `INSERT INTO portfolio (id, title, description, image, category, client, duration, workers)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        newItem.id,
        newItem.title,
        newItem.description,
        newItem.image,
        newItem.category,
        newItem.client,
        newItem.duration,
        newItem.workers,
      ]
    );

    return NextResponse.json({
      success: true,
      item: {
        ...rows[0],
        createdAt: rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

// PUT - Обновить кейс
export async function PUT(request: NextRequest) {
  try {
    const updatedItem = await request.json();

    const { rows } = await pool.query(
      `UPDATE portfolio
       SET title = $1, description = $2, image = $3, category = $4, client = $5, duration = $6, workers = $7
       WHERE id = $8
       RETURNING *`,
      [
        updatedItem.title,
        updatedItem.description,
        updatedItem.image,
        updatedItem.category,
        updatedItem.client,
        updatedItem.duration,
        updatedItem.workers,
        updatedItem.id,
      ]
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
    console.error("Error updating portfolio item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE - Удалить кейс
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    await pool.query("DELETE FROM portfolio WHERE id = $1", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
