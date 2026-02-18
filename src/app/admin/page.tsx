"use client";

import { useState } from "react";
import type { AdminTab } from "./_lib/types";
import { useAuth } from "./_hooks/useAuth";
import { usePortfolio } from "./_hooks/usePortfolio";
import { useFaq } from "./_hooks/useFaq";
import { useServices } from "./_hooks/useServices";
import { useSettings } from "./_hooks/useSettings";
import { useDocuments } from "./_hooks/useDocuments";
import { useSecurity } from "./_hooks/useSecurity";
import { LoginForm } from "./_components/LoginForm";
import { AdminHeader } from "./_components/AdminHeader";
import { AdminTabs } from "./_components/AdminTabs";
import { PortfolioTab } from "./_components/PortfolioTab";
import { SettingsTab } from "./_components/SettingsTab";
import { DocumentsTab } from "./_components/DocumentsTab";
import { BlocksTab } from "./_components/BlocksTab";
import { FaqTab } from "./_components/FaqTab";
import { ServicesTab } from "./_components/ServicesTab";
import { SecurityTab } from "./_components/SecurityTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("portfolio");

  const auth = useAuth();
  const portfolio = usePortfolio(auth.isAuthenticated);
  const faq = useFaq(auth.isAuthenticated);
  const services = useServices(auth.isAuthenticated);
  const settings = useSettings(auth.isAuthenticated);
  const documents = useDocuments(auth.isAuthenticated);
  const security = useSecurity(auth.isAuthenticated);

  // Loading state
  if (auth.isCheckingAuth) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[oklch(0.75_0.18_50)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // Login form
  if (!auth.isAuthenticated) {
    return <LoginForm {...auth} />;
  }

  // Admin dashboard
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <AdminHeader onLogout={auth.handleLogout} />
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "portfolio" && <PortfolioTab {...portfolio} />}
        {activeTab === "settings" && <SettingsTab {...settings} />}
        {activeTab === "documents" && <DocumentsTab {...documents} />}
        {activeTab === "blocks" && <BlocksTab {...settings} />}
        {activeTab === "faq" && <FaqTab {...faq} />}
        {activeTab === "services" && <ServicesTab {...services} />}
        {activeTab === "security" && <SecurityTab {...security} />}
      </div>
    </main>
  );
}
