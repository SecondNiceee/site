import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET_NAME = "uploads";

export async function POST(request: NextRequest) {
  try {
    // Проверка наличия Supabase Admin клиента
    if (!supabaseAdmin) {
      console.error("Supabase Admin клиент не настроен. Проверьте SUPABASE_SERVICE_ROLE_KEY.");
      return NextResponse.json(
        { 
          error: "Сервис загрузки файлов не настроен. Проверьте конфигурацию Supabase." 
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("Получен запрос на загрузку файла в Supabase Storage");

    if (!file) {
      console.error("Файл не предоставлен");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("Файл получен:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      console.error("Неподдерживаемый тип файла:", file.type);
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("Файл слишком большой:", file.size);
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = filename;

    console.log("Загрузка файла в Supabase Storage:", filePath);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false, // Не перезаписывать существующие файлы
      });

    if (error) {
      console.error("Ошибка загрузки в Supabase Storage:", error);
      
      // Проверка на существующий файл
      if (error.message.includes("already exists") || error.message.includes("duplicate")) {
        // Если файл уже существует, генерируем новое имя
        const newFilename = `${timestamp}-${Math.random().toString(36).substring(7)}-${Date.now()}.${ext}`;
        const retryResult = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .upload(newFilename, buffer, {
            contentType: file.type,
            upsert: false,
          });
        
        if (retryResult.error) {
          return NextResponse.json(
            { error: `Ошибка загрузки файла: ${retryResult.error.message}` },
            { status: 500 }
          );
        }
        
        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(newFilename);
        
        console.log("Файл успешно загружен в Supabase Storage:", newFilename);
        return NextResponse.json({ success: true, url: urlData.publicUrl });
      }
      
      return NextResponse.json(
        { error: `Ошибка загрузки файла: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("Данные не получены после загрузки");
      return NextResponse.json(
        { error: "Ошибка загрузки файла: данные не получены" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    console.log("Файл успешно загружен в Supabase Storage:", filePath);
    console.log("Публичный URL:", urlData.publicUrl);

    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl 
    });
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to upload file: ${errorMessage}` },
      { status: 500 }
    );
  }
}

