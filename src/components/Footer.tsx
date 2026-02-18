"use client";

import { motion } from "framer-motion";
import { Send, MessageCircle, Phone, ArrowUp } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";

const footerLinks = {
  navigation: [
    { label: "Главная", href: "#" },
    { label: "Услуги", href: "#services" },
    { label: "О нас", href: "#about" },
    { label: "Контакты", href: "#contacts" },
  ],
  legal: [
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Договор оферты", href: "/offer" },
  ],
};

export default function Footer() {
  const { settings } = useSettings();
  const { theme } = useTheme();

  // Format phone for tel: link
  const phoneLink = settings.contacts.phone.replace(/[^+\d]/g, "");

  // Logo based on settings or theme fallback
  const showLogo = settings.logo?.enabled !== false; // По умолчанию показываем
  const logoSrc = settings.logo?.url
    ? settings.logo.url
    : theme === "dark" ? "/logo_white.png" : "/logo_black.png";

  const socialLinks = [
    ...(settings.social.telegram ? [{
      name: "Telegram",
      icon: Send,
      href: settings.social.telegram,
    }] : []),
    ...(settings.social.whatsapp ? [{
      name: "WhatsApp",
      icon: MessageCircle,
      href: settings.social.whatsapp,
    }] : []),
    {
      name: "Телефон",
      icon: Phone,
      href: `tel:${phoneLink}`,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border">
      {/* Main footer content */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-3 mb-6">
              {showLogo && (
                <Image
                  src={logoSrc}
                  alt="Тяжёлый Профиль"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              )}
              <span className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wider">
                Тяжёлый
                <span className="text-[oklch(0.75_0.18_50)]"> Профиль</span>
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              {settings.company.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-[oklch(0.75_0.18_50)] hover:text-black transition-colors duration-300"
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Навигация</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          {settings.visibility?.documents !== false && (
            <div>
              <h3 className="font-semibold text-foreground mb-4">Документы</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {settings.company.name}.
            </p>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300"
            >
              Наверх
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
