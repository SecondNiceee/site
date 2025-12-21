import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Логин и пароль обязательны" },
        { status: 400 }
      );
    }
    
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Supabase не настроен" },
        { status: 500 }
      );
    }

    // Получаем данные администратора из БД
    // Пытаемся получить username и password, если username отсутствует - используем значение по умолчанию
    const { data, error } = await supabaseAdmin
      .from("admin")
      .select("*")
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error("Error fetching admin:", error);
      return NextResponse.json(
        { success: false, message: "Ошибка аутентификации. Проверьте, что таблица admin существует и содержит данные." },
        { status: 500 }
      );
    }
    
    // Если username отсутствует в БД, используем значение по умолчанию "admin"
    const dbUsername = data.username || "admin";
    
    // Проверяем логин и пароль
    if (username === dbUsername && password === data.password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Неверный логин или пароль" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error authenticating:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка аутентификации" },
      { status: 500 }
    );
  }
}

