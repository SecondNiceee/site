import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Rate limiting: 5 attempts per IP, then block for 24 hours
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface LoginAttempt {
  count: number;
  firstAttempt: number;
  blockedUntil: number | null;
}

// In-memory store for login attempts (persists across requests in the same process)
const loginAttempts = new Map<string, LoginAttempt>();

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, attempt] of loginAttempts.entries()) {
    // Remove entries where block has expired and we can reset
    if (attempt.blockedUntil && now > attempt.blockedUntil) {
      loginAttempts.delete(ip);
    }
    // Remove old entries that are not blocked and older than 24h
    if (!attempt.blockedUntil && now - attempt.firstAttempt > BLOCK_DURATION_MS) {
      loginAttempts.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): { blocked: boolean; remainingAttempts: number; blockedUntil: number | null } {
  cleanupExpiredEntries();
  
  const attempt = loginAttempts.get(ip);
  
  if (!attempt) {
    return { blocked: false, remainingAttempts: MAX_ATTEMPTS, blockedUntil: null };
  }
  
  // Check if currently blocked
  if (attempt.blockedUntil) {
    const now = Date.now();
    if (now < attempt.blockedUntil) {
      return { blocked: true, remainingAttempts: 0, blockedUntil: attempt.blockedUntil };
    }
    // Block expired, reset
    loginAttempts.delete(ip);
    return { blocked: false, remainingAttempts: MAX_ATTEMPTS, blockedUntil: null };
  }
  
  const remaining = MAX_ATTEMPTS - attempt.count;
  return { blocked: false, remainingAttempts: remaining, blockedUntil: null };
}

function recordFailedAttempt(ip: string): { blocked: boolean; remainingAttempts: number; blockedUntil: number | null } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  
  if (!attempt) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now, blockedUntil: null });
    return { blocked: false, remainingAttempts: MAX_ATTEMPTS - 1, blockedUntil: null };
  }
  
  attempt.count += 1;
  
  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.blockedUntil = now + BLOCK_DURATION_MS;
    loginAttempts.set(ip, attempt);
    return { blocked: true, remainingAttempts: 0, blockedUntil: attempt.blockedUntil };
  }
  
  loginAttempts.set(ip, attempt);
  return { blocked: false, remainingAttempts: MAX_ATTEMPTS - attempt.count, blockedUntil: null };
}

function resetAttempts(ip: string) {
  loginAttempts.delete(ip);
}

function formatTimeRemaining(blockedUntil: number): string {
  const remaining = blockedUntil - Date.now();
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours} ч. ${minutes} мин.`;
  }
  return `${minutes} мин.`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    // Check if IP is blocked
    const rateLimit = checkRateLimit(ip);
    if (rateLimit.blocked) {
      const timeRemaining = formatTimeRemaining(rateLimit.blockedUntil!);
      return NextResponse.json(
        { 
          success: false, 
          message: `Слишком много попыток входа. Доступ заблокирован на 24 часа. Осталось: ${timeRemaining}`,
          blocked: true,
          blockedUntil: rateLimit.blockedUntil,
        },
        { status: 429 }
      );
    }

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
      // Success - reset attempts for this IP
      resetAttempts(ip);
      return NextResponse.json({ success: true });
    } else {
      // Failed - record attempt
      const result = recordFailedAttempt(ip);
      
      if (result.blocked) {
        const timeRemaining = formatTimeRemaining(result.blockedUntil!);
        return NextResponse.json(
          { 
            success: false, 
            message: `Превышено количество попыток (${MAX_ATTEMPTS}). Доступ заблокирован на 24 часа. Осталось: ${timeRemaining}`,
            blocked: true,
            blockedUntil: result.blockedUntil,
          },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Неверный логин или пароль. Осталось попыток: ${result.remainingAttempts}`,
          remainingAttempts: result.remainingAttempts,
        },
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
