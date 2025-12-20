"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/useSettings";

export default function Contacts() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Format phone for tel: link
  const phoneLink = settings.contacts.phone.replace(/[^+\d]/g, "");

  const contactInfo = [
    {
      icon: Phone,
      label: "Телефон",
      value: settings.contacts.phone,
      href: `tel:${phoneLink}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.contacts.email,
      href: `mailto:${settings.contacts.email}`,
    },
    {
      icon: MapPin,
      label: "Адрес",
      value: settings.contacts.address,
      href: "#",
    },
  ];

  const socialLinks = [
    ...(settings.social.telegram ? [{
      name: "Telegram",
      icon: Send,
      href: settings.social.telegram,
      color: "bg-[#0088cc]",
    }] : []),
    ...(settings.social.whatsapp ? [{
      name: "WhatsApp",
      icon: MessageCircle,
      href: settings.social.whatsapp,
      color: "bg-[#25D366]",
    }] : []),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacts" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl translate-x-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Контакты
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
          >
            Свяжитесь <span className="gradient-text">с нами</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Оставьте заявку или свяжитесь с нами любым удобным способом.
            Мы ответим в течение 30 минут!
          </motion.p>
        </div>

        <div className={`grid grid-cols-1 ${settings.form?.enabled !== false ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-2xl mx-auto'} gap-12 lg:gap-20`}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Contact cards */}
            <div className="space-y-4 mb-10">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-[oklch(0.75_0.18_50)/30] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)/10] flex items-center justify-center group-hover:bg-[oklch(0.75_0.18_50)/20] transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-semibold group-hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Или напишите в мессенджер:
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-3 px-6 py-3 rounded-full ${social.color} text-white font-medium transition-all duration-300 hover:shadow-lg`}
                    >
                      <social.icon className="w-5 h-5" />
                      {social.name}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Working hours */}
            {settings.workingHours?.enabled !== false && (
              <div className="mt-10 p-6 rounded-2xl bg-card/50 border border-border">
                <h3 className="font-semibold mb-3">Режим работы</h3>
                <p className="text-muted-foreground text-sm">
                  Пн-Пт: 9:00 — 20:00
                  <br />
                  Сб-Вс: 10:00 — 18:00
                  <br />
                  <span className="text-[oklch(0.75_0.18_50)]">
                    Срочные заявки — круглосуточно
                  </span>
                </p>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          {settings.form?.enabled !== false && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form
                onSubmit={handleSubmit}
                className="p-8 md:p-10 rounded-3xl bg-card border border-border"
              >
              <h3 className="font-[var(--font-oswald)] text-2xl font-bold uppercase mb-2">
                Оставить заявку
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Заполните форму и мы свяжемся с вами в ближайшее время
              </p>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Ваше имя
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="bg-background border-border focus:border-[oklch(0.75_0.18_50)] h-12"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Телефон
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="bg-background border-border focus:border-[oklch(0.75_0.18_50)] h-12"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Сообщение (опционально)
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Опишите вашу задачу..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="bg-background border-border focus:border-[oklch(0.75_0.18_50)] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold h-14 text-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      />
                      Отправка...
                    </span>
                  ) : (
                    "Отправить заявку"
                  )}
                </Button>

                {/* Status messages */}
                {submitStatus === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-500 text-center"
                  >
                    ✓ Заявка успешно отправлена! Мы скоро свяжемся с вами.
                  </motion.p>
                )}
                {submitStatus === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-center"
                  >
                    Ошибка отправки. Попробуйте позже или свяжитесь по телефону.
                  </motion.p>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a
                    href="/privacy"
                    className="text-[oklch(0.75_0.18_50)] hover:underline"
                  >
                    политикой конфиденциальности
                  </a>
                </p>
              </div>
            </form>
          </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
