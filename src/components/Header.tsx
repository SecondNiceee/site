"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/components/ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#services", label: "Услуги", blockKey: "services" },
  { href: "#about", label: "О нас", blockKey: "about" },
  { href: "#portfolio", label: "Портфолио", blockKey: "portfolio" },
  { href: "#how-it-works", label: "Как работаем", blockKey: "howItWorks" },
  { href: "#faq", label: "FAQ", blockKey: "faq" },
  { href: "#contacts", label: "Контакты", blockKey: "contacts" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // Filter nav links based on enabled blocks
  const blocks = settings?.blocks || {
    hero: true,
    services: true,
    about: true,
    portfolio: true,
    howItWorks: true,
    faq: true,
    contacts: true,
  };
  
  const visibleNavLinks = navLinks.filter((link) => {
    if (!link.blockKey) return true;
    return blocks[link.blockKey as keyof typeof blocks] !== false;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (isHomePage) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/${href}`);
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  // Format phone for tel: link
  const phoneLink = settings.contacts.phone.replace(/[^+\d]/g, "");

  // Logo based on settings or theme fallback
  const showLogo = settings.logo?.enabled !== false;
  const logoSrc = settings.logo?.url
    ? settings.logo.url
    : theme === "dark" ? "/logo_white.png" : "/logo_black.png";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-slide-down",
          isScrolled ? "glass py-3" : "bg-transparent py-5"
        )}
        style={{ willChange: 'background-color, backdrop-filter' }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-3 hover-scale-micro">
                {showLogo && (
                  <Image
                    src={logoSrc}
                    alt="Тяжёлый Профиль"
                    width={64}
                    height={64}
                    className="w-14 h-14 md:w-16 md:h-16 object-contain"
                  />
                )}
                <div className="hidden sm:block">
                  <span className="font-[var(--font-oswald)] text-lg md:text-xl font-bold uppercase tracking-wider">
                    Тяжёлый
                  </span>
                  <span className="font-[var(--font-oswald)] text-lg md:text-xl font-bold uppercase tracking-wider text-[oklch(0.75_0.18_50)]">
                    {" "}Профиль
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {visibleNavLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 relative group hover:-translate-y-0.5"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[oklch(0.75_0.18_50)] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-secondary transition-colors hover-scale"
                title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                )}
              </button>

              <a
                href={`tel:${phoneLink}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{settings.contacts.phone}</span>
              </a>
              {blocks.contacts && (
                <Button
                  onClick={() => scrollToSection("#contacts")}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold px-6"
                >
                  Связаться
                </Button>
              )}
            </div>

            {/* Mobile Right Side */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Theme Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-secondary transition-colors active:scale-90"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 active:scale-95 transition-transform"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden animate-fade-in" style={{ animationDuration: "0.2s" }}>
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav
            className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-background border-l border-border p-8 pt-24 animate-slide-in-right"
          >
            <div className="flex flex-col gap-6">
              {visibleNavLinks.map((link, index) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-lg font-medium text-left hover:text-[oklch(0.75_0.18_50)] transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-border my-4" />
              <a
                href={`tel:${phoneLink}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{settings.contacts.phone}</span>
              </a>
              {blocks.contacts && (
                <Button
                  onClick={() => scrollToSection("#contacts")}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold w-full mt-4"
                  size="lg"
                >
                  Связаться
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}

    </>
  );
}
