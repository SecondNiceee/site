import { useState, useRef, useEffect } from "react";
import {
  FolderOpen, Settings, FileText, HelpCircle, Briefcase, Lock,
} from "lucide-react";
import type { AdminTab } from "../_lib/types";

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: "portfolio", label: "Портфолио", icon: FolderOpen },
  { key: "settings", label: "Настройки сайта", icon: Settings },
  { key: "documents", label: "Документы", icon: FileText },
  { key: "blocks", label: "Блоки сайта", icon: Settings },
  { key: "faq", label: "FAQ", icon: HelpCircle },
  { key: "services", label: "Услуги", icon: Briefcase },
  { key: "security", label: "Безопасность", icon: Lock },
];

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && tabsRef.current) {
      const tabRect = activeRef.current.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left + tabsRef.current.scrollLeft,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  return (
    <div ref={tabsRef} className="relative flex gap-2 mb-8 border-b border-border overflow-x-auto scrollbar-hide">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          ref={activeTab === key ? activeRef : undefined}
          onClick={() => onTabChange(key)}
          className={`px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${
            activeTab === key
              ? "text-[oklch(0.75_0.18_50)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </div>
        </button>
      ))}
      {/* Animated indicator via CSS transition instead of framer-motion layoutId */}
      <div
        className="absolute bottom-0 h-0.5 bg-[oklch(0.75_0.18_50)] transition-all duration-300 ease-out"
        style={indicatorStyle}
      />
    </div>
  );
}
