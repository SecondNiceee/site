"use client";

import { useState, useRef } from "react";
import {
  Building2,
  Warehouse,
  Wrench,
  Factory,
  HardHat,
  Truck,
  Package,
  Hammer,
  ShieldCheck,
  Users,
  ClipboardList,
  Cog,
  Landmark,
  PaintBucket,
  Ruler,
  Layers,
  Zap,
  Home,
  Drill,
  Fence,
  Handshake,
  Construction,
  Container,
  Forklift,
  type LucideIcon,
  Upload,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ICON_LIST: { name: string; icon: LucideIcon }[] = [
  { name: "Building2", icon: Building2 },
  { name: "Warehouse", icon: Warehouse },
  { name: "Wrench", icon: Wrench },
  { name: "Factory", icon: Factory },
  { name: "HardHat", icon: HardHat },
  { name: "Truck", icon: Truck },
  { name: "Package", icon: Package },
  { name: "Hammer", icon: Hammer },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Users", icon: Users },
  { name: "ClipboardList", icon: ClipboardList },
  { name: "Cog", icon: Cog },
  { name: "Landmark", icon: Landmark },
  { name: "PaintBucket", icon: PaintBucket },
  { name: "Ruler", icon: Ruler },
  { name: "Layers", icon: Layers },
  { name: "Zap", icon: Zap },
  { name: "Home", icon: Home },
  { name: "Drill", icon: Drill },
  { name: "Fence", icon: Fence },
  { name: "Handshake", icon: Handshake },
  { name: "Construction", icon: Construction },
  { name: "Container", icon: Container },
  { name: "Forklift", icon: Forklift },
];

const ICON_LABELS: Record<string, string> = {
  Building2: "Здание",
  Warehouse: "Склад",
  Wrench: "Ключ",
  Factory: "Завод",
  HardHat: "Каска",
  Truck: "Грузовик",
  Package: "Посылка",
  Hammer: "Молоток",
  ShieldCheck: "Щит",
  Users: "Люди",
  ClipboardList: "Список",
  Cog: "Шестерёнка",
  Landmark: "Ориентир",
  PaintBucket: "Краска",
  Ruler: "Линейка",
  Layers: "Слои",
  Zap: "Молния",
  Home: "Дом",
  Drill: "Дрель",
  Fence: "Забор",
  Handshake: "Рукопожатие",
  Construction: "Стройка",
  Container: "Контейнер",
  Forklift: "Погрузчик",
};

interface IconPickerProps {
  value: string; // icon name like "Building2" or a URL like "/uploads/..."
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCustomImage = value.startsWith("/uploads/") || value.startsWith("http");

  const filteredIcons = searchQuery
    ? ICON_LIST.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ICON_LABELS[item.name] || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ICON_LIST;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
      } else {
        alert("Ошибка загрузки файла");
      }
    } catch (error) {
      console.error("Error uploading icon:", error);
      alert("Ошибка загрузки файла");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium mb-1">Иконка</label>

      {/* Current selection preview */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
        <div className="w-10 h-10 rounded-lg bg-[oklch(0.75_0.18_50)/10] flex items-center justify-center shrink-0">
          {isCustomImage ? (
            <img src={value} alt="icon" className="w-6 h-6 object-contain" />
          ) : (
            (() => {
              const found = ICON_LIST.find((i) => i.name === value);
              if (found) {
                const IconComp = found.icon;
                return <IconComp className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />;
              }
              return <Building2 className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />;
            })()
          )}
        </div>
        <span className="text-sm text-muted-foreground flex-1">
          {isCustomImage
            ? "Загруженное изображение"
            : ICON_LABELS[value] || value}
        </span>
        {isCustomImage && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange("Building2")}
            className="text-red-500 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Upload custom image */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Загрузить своё изображение
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск иконки..."
          className="pl-9 bg-background border-border"
        />
      </div>

      {/* Icon grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-1">
        {filteredIcons.map((item) => {
          const IconComp = item.icon;
          const isSelected = value === item.name;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onChange(item.name)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[oklch(0.75_0.18_50)] bg-[oklch(0.75_0.18_50)/10] text-[oklch(0.75_0.18_50)]"
                  : "border-transparent hover:border-border hover:bg-secondary/50 text-muted-foreground"
              }`}
              title={ICON_LABELS[item.name] || item.name}
            >
              <IconComp className="w-5 h-5" />
              <span className="text-[10px] mt-1 truncate w-full text-center">
                {ICON_LABELS[item.name] || item.name}
              </span>
            </button>
          );
        })}
        {filteredIcons.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground py-4">
            Ничего не найдено
          </p>
        )}
      </div>
    </div>
  );
}
