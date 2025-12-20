"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Warehouse, Wrench, Factory,
  LucideIcon
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order_index?: number;
}

// Маппинг иконок
const iconMap: Record<string, LucideIcon> = {
  Building2,
  Warehouse,
  Wrench,
  Factory,
};

export default function Services() {
  const { settings } = useSettings();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchServices = async () => {
      // Fallback данные
      const fallbackServices: ServiceItem[] = [
        {
          id: "1",
          title: "Строительные объекты",
          description: "Разнорабочие, подсобники, бетонщики, каменщики — любые строительные специальности для объектов любого масштаба",
          icon: "Building2",
          features: ["Жилые комплексы", "Коммерческая недвижимость", "Инфраструктура"],
          order_index: 1,
        },
        {
          id: "2",
          title: "Складские работы",
          description: "Грузчики, комплектовщики, упаковщики — слаженная работа на складах любой сложности",
          icon: "Warehouse",
          features: ["Погрузка/разгрузка", "Комплектация заказов", "Инвентаризация"],
          order_index: 2,
        },
        {
          id: "3",
          title: "Монтажные работы",
          description: "Монтажники металлоконструкций, сборщики, слесари — точная и безопасная работа на высоте и на земле",
          icon: "Wrench",
          features: ["Металлоконструкции", "Оборудование", "Инженерные системы"],
          order_index: 3,
        },
        {
          id: "4",
          title: "Промышленные работы",
          description: "Операторы станков, наладчики, разнорабочие на производство — бесперебойная работа вашего предприятия",
          icon: "Factory",
          features: ["Производственные линии", "Техобслуживание", "Подсобные работы"],
          order_index: 4,
        },
      ];

      // Сначала устанавливаем fallback данные, чтобы они отображались сразу
      setServices(fallbackServices);
      setIsLoading(false);

      // Затем пытаемся загрузить данные из API
      try {
        const response = await fetch("/api/admin/services");
        if (response.ok) {
          const data = await response.json();
          // Если данные есть, используем их
          if (data.items && Array.isArray(data.items) && data.items.length > 0) {
            setServices(data.items);
          }
        } else {
          console.error("Failed to fetch services:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = () => {
    const contactsElement = document.querySelector("#contacts");
    if (contactsElement) {
      contactsElement.scrollIntoView({ behavior: "smooth" });
    } else if (settings.form?.enabled !== false) {
      // Если форма включена, но секция контактов не найдена, открываем модальное окно
      // (можно добавить модальное окно позже, если нужно)
      window.location.href = "/#contacts";
    }
  };

  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

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
            Наши услуги
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
          >
            Подберём специалистов
            <br />
            <span className="gradient-text">под любую задачу</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Мы точно понимаем, какие специалисты нужны под каждую задачу,
            и предоставляем именно их
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px] col-span-2">
              <div className="w-8 h-8 border-2 border-[oklch(0.75_0.18_50)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length > 0 ? (
            services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Building2;
              return (
                <div
                  key={service.id}
                  className="group relative"
                >
                    <div 
                      onClick={handleServiceClick}
                      className="relative h-full p-8 md:p-10 rounded-3xl bg-card border border-border hover:border-[oklch(0.75_0.18_50)/30] transition-all duration-500 overflow-hidden cursor-pointer"
                    >
                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.75_0.18_50)/5] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Number */}
                      <span className="absolute top-6 right-6 font-[var(--font-oswald)] text-7xl md:text-8xl font-bold text-white/[0.03] group-hover:text-[oklch(0.75_0.18_50)/10] transition-colors duration-500">
                        {String((service.order_index || index) + 1).padStart(2, "0")}
                      </span>

                      <div className="relative z-10">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[oklch(0.75_0.18_50)/10] text-[oklch(0.75_0.18_50)] mb-6 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-7 h-7" />
                        </div>

                        {/* Title */}
                        <h3 className="font-[var(--font-oswald)] text-xl md:text-2xl font-bold uppercase mb-4 group-hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-muted-foreground text-center py-8 col-span-2">
              Услуги пока не добавлены
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

