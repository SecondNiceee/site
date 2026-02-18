import { motion } from "framer-motion";
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
  return (
    <div className="flex gap-2 mb-8 border-b border-border">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === key
              ? "text-[oklch(0.75_0.18_50)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </div>
          {activeTab === key && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.75_0.18_50)]"
            />
          )}
        </button>
      ))}
    </div>
  );
}
