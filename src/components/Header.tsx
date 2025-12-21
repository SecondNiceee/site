"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/components/ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#services", label: "Услуги", blockKey: "services" },
  { href: "#about", label: "О нас", blockKey: "about" },
  { href: "#portfolio", label: "Кейсы", blockKey: "portfolio" },
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
      // На главной странице - скроллим к секции
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // На других страницах - переходим на главную с якорем
      router.push(`/${href}`);
      // После перехода скроллим к секции
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
  const showLogo = settings.logo?.enabled !== false; // По умолчанию показываем
  const logoSrc = settings.logo?.url
    ? settings.logo.url
    : theme === "dark" ? "/logo_white.png" : "/logo_black.png";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass py-3"
            : "bg-transparent py-5"
        }`}
        style={{ willChange: 'background-color, backdrop-filter' }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3"
              >
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
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {visibleNavLinks.map((link) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[oklch(0.75_0.18_50)] transition-all duration-300 group-hover:w-full" />
                </motion.button>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                )}
              </motion.button>

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
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-background border-l border-border p-8 pt-24"
            >
              <div className="flex flex-col gap-6">
                {visibleNavLinks.map((link, index) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(link.href)}
                    className="text-lg font-medium text-left hover:text-[oklch(0.75_0.18_50)] transition-colors"
                  >
                    {link.label}
                  </motion.button>
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
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
