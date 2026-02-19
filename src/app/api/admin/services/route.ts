import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET - Получить все услуги
export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM services ORDER BY order_index ASC"
    );

    const items = rows.map((item) => {
      // Обработка features - может быть массивом или JSONB строкой
      let features: string[] = [];
      if (Array.isArray(item.features)) {
        features = item.features;
      } else if (typeof item.features === "string") {
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
    return NextResponse.json({ items: [] });
  }
}

// POST - Создать новую услугу
export async function POST(request: NextRequest) {
  try {
    const newItem = await request.json();

    const { rows } = await pool.query(
      `INSERT INTO services (id, title, description, icon, features, order_index)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        newItem.id,
        newItem.title,
        newItem.description,
        newItem.icon,
        JSON.stringify(newItem.features || []),
        newItem.order_index || 0,
      ]
    );

    return NextResponse.json({
      success: true,
      item: {
        ...rows[0],
        features: rows[0].features || [],
        createdAt: rows[0].created_at,
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
    const updatedItem = await request.json();

    const { rows } = await pool.query(
      `UPDATE services
       SET title = $1, description = $2, icon = $3, features = $4, order_index = $5
       WHERE id = $6
       RETURNING *`,
      [
        updatedItem.title,
        updatedItem.description,
        updatedItem.icon,
        JSON.stringify(updatedItem.features || []),
        updatedItem.order_index || 0,
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
        features: rows[0].features || [],
        createdAt: rows[0].created_at,
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
    const { id } = await request.json();

    await pool.query("DELETE FROM services WHERE id = $1", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
