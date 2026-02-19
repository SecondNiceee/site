import { NextRequest, NextResponse } from "next/server";

interface TelegramMessage {
  name: string;
  phone: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramMessage = await request.json();
    const { name, phone, message } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Имя и телефон обязательны" },
        { status: 400 }
      );
    }

    // Get Telegram credentials from environment
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram credentials not configured");
      return NextResponse.json(
        { error: "Сервис временно недоступен" },
        { status: 500 }
      );
    }

    // Format message for Telegram
    const telegramMessage = `
🔔 *Новая заявка с сайта!*

👤 *Имя:* ${escapeMarkdown(name)}
📞 *Телефон:* ${escapeMarkdown(phone)}
${message ? `💬 *Сообщение:* ${escapeMarkdown(message)}` : ""}

📅 *Дата:* ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}
    `.trim();

    // Send message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error("Telegram API error:", errorData);
      return NextResponse.json(
        { error: "Ошибка отправки сообщения" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// Escape special characters for Telegram Markdown v1
function escapeMarkdown(text: string): string {
  return text.replace(/[_*`\[]/g, "\\$&");
}

