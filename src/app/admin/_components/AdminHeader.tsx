import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <a
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm mb-2 inline-block"
        >
          {"← На сайт"}
        </a>
        <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase">
          Админ-панель
        </h1>
      </div>
      <Button
        onClick={onLogout}
        variant="outline"
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Выйти
      </Button>
    </div>
  );
}
