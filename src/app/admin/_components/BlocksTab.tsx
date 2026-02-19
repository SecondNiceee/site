import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteSettings } from "../_lib/types";
import type { useSettings } from "../_hooks/useSettings";

type BlocksTabProps = Pick<ReturnType<typeof useSettings>, "settings" | "savingSettings" | "toggleBlock" | "handleSaveBlocks">;

const blockNames: Record<string, string> = {
  hero: "Главный экран (Hero)",
  services: "Услуги",
  about: "О нас",
  portfolio: "Портфолио",
  howItWorks: "Как мы работаем",
  faq: "Часто задаваемые вопросы",
  contacts: "Контакты",
};

export function BlocksTab({
  settings,
  savingSettings,
  toggleBlock,
  handleSaveBlocks,
}: BlocksTabProps) {
  if (!settings) return null;

  return (
    <div className="space-y-8">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Управление блоками сайта
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Включите или отключите отображение блоков на главной странице
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(settings.blocks).map(([blockKey, isEnabled]) => (
              <div
                key={blockKey}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{blockNames[blockKey] || blockKey}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isEnabled ? "Отображается на сайте" : "Скрыт на сайте"}
                  </p>
                </div>
                <button
                  onClick={() => toggleBlock(blockKey as keyof SiteSettings["blocks"])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled
                      ? "bg-[oklch(0.75_0.18_50)]"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveBlocks}
          disabled={savingSettings}
          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
        >
          {savingSettings ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Сохранить настройки блоков
        </Button>
      </div>
    </div>
  );
}
