import { NextResponse } from "next/server";
import pool from "@/lib/db";

const defaultDocuments = { privacy: { sections: [] }, offer: { sections: [] } };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "privacy" or "offer"

    const { rows } = await pool.query("SELECT data FROM documents LIMIT 1");

    if (rows.length === 0) {
      if (type && (type === "privacy" || type === "offer")) {
        return NextResponse.json(defaultDocuments[type]);
      }
      return NextResponse.json(defaultDocuments);
    }

    const documents = rows[0].data || defaultDocuments;

    if (type && (type === "privacy" || type === "offer")) {
      return NextResponse.json(documents[type]);
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error reading documents:", error);
    return NextResponse.json(
      { message: "Error reading documents" },
      { status: 500 }
    );
  }
}
