"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Edit, Trash2, Save, X, Lock, Eye, EyeOff, 
  Upload, Image as ImageIcon, Settings, FolderOpen,
  Phone, Mail, MapPin, MessageCircle, Globe, FileText, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  client: string;
  duration: string;
  workers: number;
  createdAt: string;
}

interface SiteSettings {
  company: {
    name: string;
    description: string;
    slogan: string;
  };
  contacts: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    telegram: string;
    whatsapp: string;
    vk: string;
    instagram: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  meta: {
    title: string;
    description: string;
  };
  blocks: {
    hero: boolean;
    services: boolean;
    about: boolean;
    portfolio: boolean;
    howItWorks: boolean;
    faq: boolean;
    contacts: boolean;
  };
}

const categories = ["Строительство", "Склад", "Промышленность", "Монтаж"];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"portfolio" | "settings" | "documents" | "security" | "blocks">("portfolio");

  // Portfolio state
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: "",
    description: "",
    image: "",
    category: "Строительство",
    client: "",
    duration: "",
    workers: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Documents state
  interface DocumentSection {
    title: string;
    content: string[];
  }
  interface Documents {
    privacy: { sections: DocumentSection[] };
    offer: { sections: DocumentSection[] };
  }
  const [documents, setDocuments] = useState<Documents | null>(null);
  const [savingDocuments, setSavingDocuments] = useState(false);

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Check authentication on mount
  useEffect(() => {
    // Проверяем, есть ли флаг авторизации в sessionStorage
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data
  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolio();
      fetchSettings();
      fetchDocuments();
    }
  }, [isAuthenticated]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch("/api/admin/portfolio");
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/admin/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        // Сохраняем флаг авторизации
        sessionStorage.setItem("admin_authenticated", "true");
        setIsAuthenticated(true);
        setError("");
        setPassword("");
      } else {
        setError(data.message || "Неверный пароль");
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      setError("Ошибка входа");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPassword,
          currentPassword: currentPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Пароль успешно изменён!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
      } else {
        setPasswordError(data.message || "Ошибка изменения пароля");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Ошибка изменения пароля");
    } finally {
      setChangingPassword(false);
    }
  };

  // Portfolio handlers
  const handleCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      category: "Строительство",
      client: "",
      duration: "",
      workers: 0,
    });
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData(item);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({
      title: "",
      description: "",
      image: "",
      category: "Строительство",
      client: "",
      duration: "",
      workers: 0,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Проверка типа файла
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `Неподдерживаемый тип файла: ${file.type}. Разрешены только JPEG, PNG, WebP и GIF.`;
      setUploadError(errorMsg);
      console.error(errorMsg);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Проверка размера файла (макс 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = `Файл слишком большой: ${(file.size / 1024 / 1024).toFixed(2)}MB. Максимальный размер: 5MB.`;
      setUploadError(errorMsg);
      console.error(errorMsg);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploading(true);
    setUploadError(null);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      console.log("Загрузка файла:", file.name, "Тип:", file.type, "Размер:", file.size);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      console.log("Ответ сервера:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("Файл загружен успешно:", data.url);
        setFormData({ ...formData, image: data.url });
        setUploadError(null);
      } else {
        let errorMessage = "Ошибка загрузки файла";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error("Ошибка сервера:", errorData);
        } catch (parseError) {
          const text = await response.text();
          console.error("Ошибка парсинга ответа:", text);
          errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        }
        setUploadError(errorMessage);
      }
    } catch (error) {
      const errorMessage = `Ошибка загрузки файла: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`;
      console.error(errorMessage, error);
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    try {
      const method = isCreating ? "POST" : "PUT";
      const body = isCreating
        ? { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() }
        : { ...formData, id: editingItem?.id };

      const response = await fetch("/api/admin/portfolio", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchPortfolio();
        handleCancel();
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот кейс?")) return;

    try {
      const response = await fetch("/api/admin/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSavingSettings(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Настройки сохранены!");
      } else {
        alert("Ошибка сохранения настроек");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Ошибка сохранения настроек");
    } finally {
      setSavingSettings(false);
    }
  };

  const updateSettings = (section: keyof SiteSettings, field: string, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const toggleBlock = (blockName: keyof SiteSettings["blocks"]) => {
    if (!settings) return;
    setSettings({
      ...settings,
      blocks: {
        ...settings.blocks,
        [blockName]: !settings.blocks[blockName],
      },
    });
  };

  const handleSaveBlocks = async () => {
    if (!settings) return;
    
    setSavingSettings(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Настройки блоков сохранены!");
      } else {
        alert("Ошибка сохранения настроек блоков");
      }
    } catch (error) {
      console.error("Error saving blocks:", error);
      alert("Ошибка сохранения настроек блоков");
    } finally {
      setSavingSettings(false);
    }
  };

  // Documents handlers
  const handleSaveDocuments = async () => {
    if (!documents) return;
    
    setSavingDocuments(true);
    try {
      const response = await fetch("/api/admin/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documents),
      });

      if (response.ok) {
        alert("Документы сохранены!");
      } else {
        alert("Ошибка сохранения документов");
      }
    } catch (error) {
      console.error("Error saving documents:", error);
      alert("Ошибка сохранения документов");
    } finally {
      setSavingDocuments(false);
    }
  };

  const updateDocumentSection = (
    docType: "privacy" | "offer",
    sectionIndex: number,
    field: "title" | "content",
    value: string | string[]
  ) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    if (field === "title") {
      newDocuments[docType].sections[sectionIndex].title = value as string;
    } else {
      newDocuments[docType].sections[sectionIndex].content = value as string[];
    }
    setDocuments(newDocuments);
  };

  const updateDocumentParagraph = (
    docType: "privacy" | "offer",
    sectionIndex: number,
    paragraphIndex: number,
    value: string
  ) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    newDocuments[docType].sections[sectionIndex].content[paragraphIndex] = value;
    setDocuments(newDocuments);
  };

  const addDocumentParagraph = (docType: "privacy" | "offer", sectionIndex: number) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    newDocuments[docType].sections[sectionIndex].content.push("");
    setDocuments(newDocuments);
  };

  const removeDocumentParagraph = (docType: "privacy" | "offer", sectionIndex: number, paragraphIndex: number) => {
    if (!documents) return;
    const newDocuments = { ...documents };
    newDocuments[docType].sections[sectionIndex].content.splice(paragraphIndex, 1);
    setDocuments(newDocuments);
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8"
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
                >
                  Войти
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  // Admin dashboard
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm mb-2 inline-block"
            >
              ← На сайт
            </a>
            <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase">
              Админ-панель
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "portfolio"
                ? "text-[oklch(0.75_0.18_50)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Портфолио
            </div>
            {activeTab === "portfolio" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.75_0.18_50)]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "settings"
                ? "text-[oklch(0.75_0.18_50)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Настройки сайта
            </div>
            {activeTab === "settings" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.75_0.18_50)]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "documents"
                ? "text-[oklch(0.75_0.18_50)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Документы
            </div>
            {activeTab === "documents" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.75_0.18_50)]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("blocks")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "blocks"
                ? "text-[oklch(0.75_0.18_50)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Блоки сайта
            </div>
            {activeTab === "blocks" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.75_0.18_50)]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "security"
                ? "text-[oklch(0.75_0.18_50)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Безопасность
            </div>
            {activeTab === "security" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.75_0.18_50)]"
              />
            )}
          </button>
        </div>

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={handleCreate}
                className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить кейс
              </Button>
            </div>

            {/* Edit/Create Form */}
            {(isCreating || editingItem) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>
                      {isCreating ? "Новый кейс" : "Редактирование кейса"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Название
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Категория
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Клиент
                        </label>
                        <Input
                          value={formData.client}
                          onChange={(e) =>
                            setFormData({ ...formData, client: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Длительность
                        </label>
                        <Input
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({ ...formData, duration: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Кол-во сотрудников
                        </label>
                        <Input
                          type="number"
                          value={formData.workers}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              workers: parseInt(e.target.value) || 0,
                            })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Изображение
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={formData.image}
                              onChange={(e) =>
                                setFormData({ ...formData, image: e.target.value })
                              }
                              placeholder="URL или загрузите файл"
                              className="bg-background border-border flex-1"
                            />
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                            >
                              {uploading ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          {uploadError && (
                            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                              {uploadError}
                            </div>
                          )}
                          {formData.image && (
                            <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-secondary">
                              <Image
                                src={formData.image}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                              <button
                                onClick={() => {
                                  setFormData({ ...formData, image: "" });
                                  setUploadError(null);
                                }}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          Описание
                        </label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={3}
                          className="bg-background border-border"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button
                        onClick={handleSave}
                        className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Отмена
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-card border-border overflow-hidden">
                    <div className="relative h-40 bg-secondary">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-[oklch(0.75_0.18_50)/10] text-[oklch(0.75_0.18_50)]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-400"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p>Кейсы пока не добавлены</p>
                <Button
                  onClick={handleCreate}
                  className="mt-4 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black"
                >
                  Добавить первый кейс
                </Button>
              </div>
            )}
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && settings && (
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
                  <label className="block text-sm font-medium mb-2">
                    Название компании
                  </label>
                  <Input
                    value={settings.company.name}
                    onChange={(e) => updateSettings("company", "name", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Слоган
                  </label>
                  <Input
                    value={settings.company.slogan}
                    onChange={(e) => updateSettings("company", "slogan", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Описание
                  </label>
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
                    <label className="block text-sm font-medium mb-2">
                      Telegram
                    </label>
                    <Input
                      value={settings.social.telegram}
                      onChange={(e) => updateSettings("social", "telegram", e.target.value)}
                      placeholder="https://t.me/username"
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      WhatsApp
                    </label>
                    <Input
                      value={settings.social.whatsapp}
                      onChange={(e) => updateSettings("social", "whatsapp", e.target.value)}
                      placeholder="https://wa.me/79001234567"
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      ВКонтакте
                    </label>
                    <Input
                      value={settings.social.vk}
                      onChange={(e) => updateSettings("social", "vk", e.target.value)}
                      placeholder="https://vk.com/username"
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Instagram
                    </label>
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
                  Главный экран (Hero)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Заголовок
                  </label>
                  <Input
                    value={settings.hero.title}
                    onChange={(e) => updateSettings("hero", "title", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Подзаголовок
                  </label>
                  <Textarea
                    value={settings.hero.subtitle}
                    onChange={(e) => updateSettings("hero", "subtitle", e.target.value)}
                    rows={2}
                    className="bg-background border-border"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                  SEO (Meta-теги)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title страницы
                  </label>
                  <Input
                    value={settings.meta.title}
                    onChange={(e) => updateSettings("meta", "title", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meta Description
                  </label>
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
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && documents && (
          <div className="space-y-8">
            {/* Privacy Policy */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                  Политика конфиденциальности
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {documents.privacy.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-border rounded-lg p-6 space-y-4">
                    <Input
                      value={section.title}
                      onChange={(e) => updateDocumentSection("privacy", sectionIndex, "title", e.target.value)}
                      className="font-semibold text-lg bg-background border-border"
                      placeholder="Название раздела"
                    />
                    <div className="space-y-2">
                      {section.content.map((paragraph, paragraphIndex) => (
                        <div key={paragraphIndex} className="flex gap-2">
                          <Textarea
                            value={paragraph}
                            onChange={(e) => updateDocumentParagraph("privacy", sectionIndex, paragraphIndex, e.target.value)}
                            rows={2}
                            className="bg-background border-border flex-1"
                            placeholder="Текст параграфа"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDocumentParagraph("privacy", sectionIndex, paragraphIndex)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addDocumentParagraph("privacy", sectionIndex)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить параграф
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Offer */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                  Договор публичной оферты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {documents.offer.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-border rounded-lg p-6 space-y-4">
                    <Input
                      value={section.title}
                      onChange={(e) => updateDocumentSection("offer", sectionIndex, "title", e.target.value)}
                      className="font-semibold text-lg bg-background border-border"
                      placeholder="Название раздела"
                    />
                    <div className="space-y-2">
                      {section.content.map((paragraph, paragraphIndex) => (
                        <div key={paragraphIndex} className="flex gap-2">
                          <Textarea
                            value={paragraph}
                            onChange={(e) => updateDocumentParagraph("offer", sectionIndex, paragraphIndex, e.target.value)}
                            rows={2}
                            className="bg-background border-border flex-1"
                            placeholder="Текст параграфа"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDocumentParagraph("offer", sectionIndex, paragraphIndex)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addDocumentParagraph("offer", sectionIndex)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить параграф
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveDocuments}
                disabled={savingDocuments}
                className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
              >
                {savingDocuments ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Сохранить документы
              </Button>
            </div>
          </div>
        )}

        {/* Blocks Tab */}
        {activeTab === "blocks" && settings && (
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
                  {Object.entries(settings.blocks).map(([blockKey, isEnabled]) => {
                    const blockNames: Record<string, string> = {
                      hero: "Главный экран (Hero)",
                      services: "Услуги",
                      about: "О нас",
                      portfolio: "Портфолио (Кейсы)",
                      howItWorks: "Как мы работаем",
                      faq: "Часто задаваемые вопросы",
                      contacts: "Контакты",
                    };

                    return (
                      <div
                        key={blockKey}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium">{blockNames[blockKey] || blockKey}</h3>
                          <p className="text-sm text-muted-foreground">
                            {isEnabled ? "Блок отображается на сайте" : "Блок скрыт"}
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
                    );
                  })}
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
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-8">
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
                    <label className="block text-sm font-medium mb-2">
                      Текущий пароль
                    </label>
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
                    <label className="block text-sm font-medium mb-2">
                      Новый пароль
                    </label>
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
                    <label className="block text-sm font-medium mb-2">
                      Подтвердите новый пароль
                    </label>
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
                        Изменение...
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
                  <p>• Пароль должен содержать минимум 6 символов</p>
                  <p>• Для входа в админку с главной страницы сделайте двойной клик по логотипу</p>
                  <p>• После смены пароля используйте новый пароль для входа</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
