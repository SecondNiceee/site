import { 
  Save, X, Upload, Image as ImageIcon, Globe, 
  Phone, Mail, MapPin, MessageCircle, FileText, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type { useSettings } from "../_hooks/useSettings";

type SettingsTabProps = ReturnType<typeof useSettings>;

export function SettingsTab({
  settings,
  savingSettings,
  uploadingLogo,
  logoUploadError,
  setLogoUploadError,
  logoInputRef,
  updateSettings,
  handleSaveSettings,
  handleLogoUpload,
}: SettingsTabProps) {
  if (!settings) return null;

  return (
    <div className="space-y-8">
      {/* Company Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Информация о компании
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название компании</label>
            <Input
              value={settings.company.name}
              onChange={(e) => updateSettings("company", "name", e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Слоган</label>
            <Input
              value={settings.company.slogan}
              onChange={(e) => updateSettings("company", "slogan", e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Описание</label>
            <Textarea
              value={settings.company.description}
              onChange={(e) => updateSettings("company", "description", e.target.value)}
              rows={3}
              className="bg-background border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Контакты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Телефон
              </label>
              <Input
                value={settings.contacts.phone}
                onChange={(e) => updateSettings("contacts", "phone", e.target.value)}
                placeholder="+7 900 123-45-67"
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <Input
                value={settings.contacts.email}
                onChange={(e) => updateSettings("contacts", "email", e.target.value)}
                placeholder="info@example.ru"
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Адрес
              </label>
              <Input
                value={settings.contacts.address}
                onChange={(e) => updateSettings("contacts", "address", e.target.value)}
                placeholder="Москва, ул. Примерная, 123"
                className="bg-background border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Социальные сети
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Telegram</label>
              <Input
                value={settings.social.telegram}
                onChange={(e) => updateSettings("social", "telegram", e.target.value)}
                placeholder="https://t.me/username"
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp</label>
              <Input
                value={settings.social.whatsapp}
                onChange={(e) => updateSettings("social", "whatsapp", e.target.value)}
                placeholder="https://wa.me/79001234567"
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ВКонтакте</label>
              <Input
                value={settings.social.vk}
                onChange={(e) => updateSettings("social", "vk", e.target.value)}
                placeholder="https://vk.com/username"
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <Input
                value={settings.social.instagram}
                onChange={(e) => updateSettings("social", "instagram", e.target.value)}
                placeholder="https://instagram.com/username"
                className="bg-background border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            {"Главный экран (Hero)"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Заголовок</label>
            <Input
              value={settings.hero.title}
              onChange={(e) => updateSettings("hero", "title", e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Подзаголовок</label>
            <Textarea
              value={settings.hero.subtitle}
              onChange={(e) => updateSettings("hero", "subtitle", e.target.value)}
              rows={2}
              className="bg-background border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Логотип
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">URL логотипа</label>
            <div className="flex gap-2">
              <Input
                value={settings.logo?.url || ""}
                onChange={(e) => updateSettings("logo", "url", e.target.value)}
                placeholder="URL или загрузите файл"
                className="bg-background border-border flex-1"
              />
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
              >
                {uploadingLogo ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
            </div>
            {logoUploadError && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-2 mt-2">
                {logoUploadError}
              </div>
            )}
            {settings.logo?.url && (
              <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-secondary mt-2">
                <Image
                  src={settings.logo.url}
                  alt="Logo Preview"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={() => {
                    updateSettings("logo", "url", "");
                    setLogoUploadError(null);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="logo-enabled"
              checked={settings.logo?.enabled ?? true}
              onChange={(e) => updateSettings("logo", "enabled", e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="logo-enabled" className="text-sm font-medium cursor-pointer">
              Показывать логотип
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Форма заявки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="form-enabled"
              checked={settings.form?.enabled ?? true}
              onChange={(e) => updateSettings("form", "enabled", e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="form-enabled" className="text-sm font-medium cursor-pointer">
              Показывать форму заявки в разделе контактов
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Когда форма выключена, в разделе контактов будут отображаться только контактная информация и социальные сети.
          </p>
        </CardContent>
      </Card>

      {/* Working Hours Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Режим работы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="working-hours-enabled"
              checked={settings.workingHours?.enabled ?? true}
              onChange={(e) => updateSettings("workingHours", "enabled", e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="working-hours-enabled" className="text-sm font-medium cursor-pointer">
              {"Показывать блок \"Режим работы\" в разделе контактов"}
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Когда блок выключен, информация о режиме работы не будет отображаться в разделе контактов.
          </p>
        </CardContent>
      </Card>

      {/* Address Visibility */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Адрес
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="address-visible"
              checked={settings.visibility?.address ?? true}
              onChange={(e) => updateSettings("visibility", "address", e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="address-visible" className="text-sm font-medium cursor-pointer">
              Показывать адрес в разделе контактов
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Когда выключено, адрес не будет отображаться в контактной информации на сайте.
          </p>
        </CardContent>
      </Card>

      {/* Documents Visibility */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Ссылки на документы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="documents-visible"
              checked={settings.visibility?.documents ?? true}
              onChange={(e) => updateSettings("visibility", "documents", e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="documents-visible" className="text-sm font-medium cursor-pointer">
              {"Показывать ссылки на документы (Политика конфиденциальности, Договор оферты)"}
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Когда выключено, ссылки на документы не будут отображаться в футере и форме обратной связи.
          </p>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            {"SEO (Meta-теги)"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title страницы</label>
            <Input
              value={settings.meta.title}
              onChange={(e) => updateSettings("meta", "title", e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Meta Description</label>
            <Textarea
              value={settings.meta.description}
              onChange={(e) => updateSettings("meta", "description", e.target.value)}
              rows={2}
              className="bg-background border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
        >
          {savingSettings ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
}
