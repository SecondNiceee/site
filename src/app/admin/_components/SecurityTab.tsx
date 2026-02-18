import { Lock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { useSecurity } from "../_hooks/useSecurity";

type SecurityTabProps = ReturnType<typeof useSecurity>;

export function SecurityTab({
  currentUsername,
  newUsername,
  setNewUsername,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  changingPassword,
  changingUsername,
  passwordError,
  usernameError,
  handleChangeUsername,
  handleChangePassword,
}: SecurityTabProps) {
  return (
    <div className="space-y-8">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Смена логина
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeUsername} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Текущий логин</label>
              <Input
                type="text"
                value={currentUsername}
                disabled
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Новый логин</label>
              <Input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Введите новый логин"
                className="bg-background border-border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{"Текущий пароль (для подтверждения)"}</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Введите текущий пароль для подтверждения"
                className="bg-background border-border"
                required
              />
            </div>
            {usernameError && (
              <p className="text-red-500 text-sm">{usernameError}</p>
            )}
            <Button
              type="submit"
              disabled={changingUsername}
              className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
            >
              {changingUsername ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  {"Изменение..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Изменить логин
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Смена пароля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Текущий пароль</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Введите текущий пароль"
                className="bg-background border-border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Новый пароль</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль (минимум 6 символов)"
                className="bg-background border-border"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Подтвердите новый пароль</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите новый пароль"
                className="bg-background border-border"
                required
                minLength={6}
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <Button
              type="submit"
              disabled={changingPassword}
              className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
            >
              {changingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  {"Изменение..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Изменить пароль
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{"• Пароль должен содержать минимум 6 символов"}</p>
            <p>{"• Для входа в админку перейдите по адресу /admin"}</p>
            <p>{"• После смены логина или пароля используйте новые данные для входа"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
