import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access, constants } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Проверка окружения - на Vercel и других serverless платформах файловая система только для чтения
    const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;
    const isServerless = process.cwd().includes("/var/task") || process.cwd().includes("/tmp");
    
    if (isVercel || isServerless) {
      console.error("Загрузка файлов не поддерживается на serverless платформах");
      return NextResponse.json(
        { 
          error: "Загрузка файлов не поддерживается на этой платформе. Используйте Supabase Storage или другой сервис хранения файлов." 
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("Получен запрос на загрузку файла");
    console.log("Текущая рабочая директория:", process.cwd());
    console.log("Окружение:", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      isVercel,
      isServerless,
    });

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

    // Определение пути к директории uploads
    // Используем __dirname альтернативу для Next.js App Router
    const projectRoot = process.cwd();
    const uploadsDir = path.join(projectRoot, "public", "uploads");
    
    console.log("Директория для загрузки:", uploadsDir);
    console.log("Директория существует:", existsSync(uploadsDir));
    
    // Проверка прав на запись
    try {
      if (!existsSync(uploadsDir)) {
        console.log("Создание директории:", uploadsDir);
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Проверка прав на запись
      await access(uploadsDir, constants.W_OK);
      console.log("Права на запись подтверждены");
    } catch (dirError) {
      console.error("Ошибка доступа к директории:", dirError);
      const errorMsg = dirError instanceof Error ? dirError.message : "Unknown error";
      return NextResponse.json(
        { 
          error: `Нет доступа к директории для загрузки файлов: ${errorMsg}. Убедитесь, что приложение запущено в режиме разработки (npm run dev), а не в production режиме.` 
        },
        { status: 500 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    console.log("Сохранение файла:", filepath);

    // Write file
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      console.log("Файл успешно сохранен:", filename);
    } catch (writeError) {
      console.error("Ошибка записи файла:", writeError);
      const errorMsg = writeError instanceof Error ? writeError.message : "Unknown error";
      
      if (errorMsg.includes("EROFS") || errorMsg.includes("read-only")) {
        return NextResponse.json(
          { 
            error: "Файловая система доступна только для чтения. Убедитесь, что приложение запущено в режиме разработки (npm run dev), а не в production режиме. Для production используйте Supabase Storage или другой сервис хранения файлов." 
          },
          { status: 503 }
        );
      }
      
      throw writeError;
    }

    // Return the public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to upload file: ${errorMessage}` },
      { status: 500 }
    );
  }
}

