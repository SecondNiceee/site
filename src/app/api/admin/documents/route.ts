import { NextResponse } from "next/server";
import pool from "@/lib/db";

const defaultDocuments = { privacy: { sections: [] }, offer: { sections: [] } };

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT data FROM documents LIMIT 1");

    if (rows.length === 0) {
      return NextResponse.json(defaultDocuments);
    }

    return NextResponse.json(rows[0].data || defaultDocuments);
  } catch (error) {
    console.error("Error reading documents:", error);
    return NextResponse.json(
      { message: "Error reading documents" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedDocuments = await request.json();

    // Проверяем, есть ли уже запись
    const { rows: existing } = await pool.query("SELECT id FROM documents LIMIT 1");

    if (existing.length > 0) {
      await pool.query("UPDATE documents SET data = $1 WHERE id = $2", [
        JSON.stringify(updatedDocuments),
        existing[0].id,
      ]);
    } else {
      await pool.query("INSERT INTO documents (data) VALUES ($1)", [
        JSON.stringify(updatedDocuments),
      ]);
    }

    return NextResponse.json({ message: "Documents updated successfully" });
  } catch (error) {
    console.error("Error updating documents:", error);
    return NextResponse.json(
      { message: "Error updating documents" },
      { status: 500 }
    );
  }
}
