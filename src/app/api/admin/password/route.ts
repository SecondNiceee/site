import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT username, password FROM admin LIMIT 1"
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Error reading admin config" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      username: rows[0].username || "admin",
      exists: !!rows[0].password,
    });
  } catch (error) {
    console.error("Error reading admin config:", error);
    return NextResponse.json(
      { message: "Error reading admin config" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, currentPassword } = await request.json();

    // Получаем текущие данные из БД
    const { rows } = await pool.query(
      "SELECT id, username, password FROM admin LIMIT 1"
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Ошибка получения данных администратора" },
        { status: 500 }
      );
    }

    const adminData = rows[0];

    // Проверяем текущий пароль, если он указан
    if (currentPassword && currentPassword !== adminData.password) {
      return NextResponse.json(
        { message: "Неверный текущий пароль" },
        { status: 401 }
      );
    }

    // Подготавливаем обновление
    const setClauses: string[] = [];
    const values: string[] = [];
    let paramIndex = 1;

    if (password) {
      setClauses.push(`password = $${paramIndex}`);
      values.push(password);
      paramIndex++;
    }

    if (username) {
      setClauses.push(`username = $${paramIndex}`);
      values.push(username);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return NextResponse.json(
        { message: "Нет данных для обновления" },
        { status: 400 }
      );
    }

    values.push(adminData.id);
    await pool.query(
      `UPDATE admin SET ${setClauses.join(", ")} WHERE id = $${paramIndex}`,
      values
    );

    const updatedFields = [];
    if (password) updatedFields.push("пароль");
    if (username) updatedFields.push("логин");

    return NextResponse.json({
      message: `${updatedFields.join(" и ")} успешно ${updatedFields.length > 1 ? "обновлены" : "обновлен"}`,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { message: "Ошибка обновления данных" },
      { status: 500 }
    );
  }
}
