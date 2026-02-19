"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

// Portfolio data structure
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  client?: string;
  duration?: string;
  workers?: number;
}

// Set to false to show the portfolio section
const HIDE_PORTFOLIO = false;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function Portfolio() {
  const ref = useRef(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch("/api/admin/portfolio");
        if (response.ok) {
          const data = await response.json();
          setItems(data.items || []);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Hide the section if HIDE_PORTFOLIO is true or no items
  if (HIDE_PORTFOLIO || (!isLoading && items.length === 0)) {
    return null;
  }

  return (
    <section id="portfolio" className="py-24 md:py-32 relative overflow-hidden bg-card/30">
      {/* Top fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: 'translate(-50%, -50%) translateZ(0)' }} />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[oklch(0.75_0.18_50)/3] rounded-full blur-3xl translate-x-1/2 pointer-events-none" style={{ transform: 'translateX(50%) translateZ(0)' }} />

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
            Портфолио
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
          >
            <span className="gradient-text">Портфолио</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Проекты, которые мы успешно реализовали вместе с нашими клиентами
          </motion.p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-[oklch(0.75_0.18_50)/30] border-t-[oklch(0.75_0.18_50)] rounded-full"
            />
          </div>
        )}

        {/* Portfolio Grid */}
        {!isLoading && items.length > 0 && (
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group relative rounded-3xl overflow-hidden bg-card border border-border hover:border-[oklch(0.75_0.18_50)/30] transition-all duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full bg-[oklch(0.75_0.18_50)] text-black">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase mb-2 group-hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {item.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {item.client && (
                      <span>
                        Клиент: <strong className="text-foreground">{item.client}</strong>
                      </span>
                    )}
                    {item.workers && item.workers > 0 && (
                      <span>
                        Персонал: <strong className="text-foreground">{item.workers} чел.</strong>
                      </span>
                    )}
                    {item.duration && (
                      <span>
                        Срок: <strong className="text-foreground">{item.duration}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom decorative divider */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Diagonal line pattern */}
        <div className="h-px bg-gradient-to-r from-transparent via-[oklch(0.75_0.18_50)/20] to-transparent" />
        <div className="h-24 bg-gradient-to-b from-transparent to-background" />
      </div>
    </section>
  );
}
