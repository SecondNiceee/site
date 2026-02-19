import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { useAuth } from "../_hooks/useAuth";

type LoginFormProps = ReturnType<typeof useAuth>;

export function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  isBlocked,
  remainingAttempts,
  handleLogin,
}: LoginFormProps) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div
        className="w-full max-w-md p-8 animate-fade-in-up"
      >
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)/10] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[oklch(0.75_0.18_50)]" />
            </div>
            <CardTitle className="font-[var(--font-oswald)] text-2xl uppercase">
              Админ-панель
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Логин
                </label>
                <Input
                  type="text"
                  placeholder="Введите логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background border-border"
                  autoFocus
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-2">
                  Пароль
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <div className={`text-sm p-3 rounded-lg ${isBlocked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-red-500'}`}>
                  <p>{error}</p>
                  {isBlocked && (
                    <p className="mt-1 text-xs opacity-80">
                      Попробуйте снова через 24 часа или обратитесь к администратору.
                    </p>
                  )}
                </div>
              )}
              {remainingAttempts !== null && !isBlocked && remainingAttempts <= 3 && (
                <p className="text-amber-500 text-xs">
                  {"Внимание: осталось"} {remainingAttempts} {remainingAttempts === 1 ? 'попытка' : remainingAttempts <= 4 ? 'попытки' : 'попыток'} {"до блокировки"}
                </p>
              )}
              <Button
                type="submit"
                disabled={isBlocked}
                className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBlocked ? 'Доступ заблокирован' : 'Войти'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
