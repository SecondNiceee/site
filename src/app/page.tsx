"use client";

import { useSettings } from "@/hooks/useSettings";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import SectionDivider from "@/components/SectionDivider";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";

export default function Home() {
  const { settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <main className="noise-overlay min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[oklch(0.75_0.18_50)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const blocks = settings?.blocks || {
    hero: true,
    services: true,
    about: true,
    portfolio: true,
    howItWorks: true,
    faq: true,
    contacts: true,
  };

  return (
    <main className="noise-overlay min-h-screen">
      <Header />
      {blocks.hero && <Hero />}
      {blocks.services !== false && <Services />}
      {blocks.about && <About />}
      {blocks.portfolio && <Portfolio />}
      {blocks.portfolio && blocks.howItWorks && <SectionDivider />}
      {blocks.howItWorks && <HowItWorks />}
      {blocks.faq && <FAQ />}
      {blocks.contacts && <Contacts />}
      <Footer />
    </main>
  );
}
