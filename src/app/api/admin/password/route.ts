import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("admin")
      .select("username, password")
      .limit(1)
      .single();

    if (error) {
      console.error("Error reading admin config:", error);
      return NextResponse.json(
        { message: "Error reading admin config" },
        { status: 500 }
      );
    }

    // Возвращаем только username, пароль не возвращаем
    return NextResponse.json({ 
      username: data?.username || "admin",
      exists: !!data?.password 
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
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const { username, password, currentPassword } = await request.json();
    
    // Получаем текущие данные из БД
    const { data: adminData, error: fetchError } = await supabaseAdmin
      .from("admin")
      .select("id, username, password")
      .limit(1)
      .single();
    
    if (fetchError || !adminData) {
      console.error("Error fetching admin:", fetchError);
      return NextResponse.json(
        { message: "Ошибка получения данных администратора" },
        { status: 500 }
      );
    }
    
    // Проверяем текущий пароль, если он указан
    if (currentPassword && currentPassword !== adminData.password) {
      return NextResponse.json(
        { message: "Неверный текущий пароль" },
        { status: 401 }
      );
    }
    
    // Подготавливаем объект для обновления
    const updateData: { password?: string; username?: string } = {};
    
    if (password) {
      updateData.password = password;
    }
    
    if (username) {
      updateData.username = username;
    }
    
    // Обновляем данные
    const { error: updateError } = await supabaseAdmin
      .from("admin")
      .update(updateData)
      .eq("id", adminData.id);
    
    if (updateError) {
      console.error("Error updating admin:", updateError);
      return NextResponse.json(
        { message: "Ошибка обновления данных" },
        { status: 500 }
      );
    }
    
    const updatedFields = [];
    if (password) updatedFields.push("пароль");
    if (username) updatedFields.push("логин");
    
    return NextResponse.json({ 
      message: `${updatedFields.join(" и ")} успешно ${updatedFields.length > 1 ? "обновлены" : "обновлен"}` 
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { message: "Ошибка обновления данных" },
      { status: 500 }
    );
  }
}

