'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TransitionSection from '@/components/TransitionSection';
import AboutSection from '@/components/AboutSection';
import HistorySection from '@/components/HistorySection';
import PortfolioSection from '@/components/PortfolioSection';
import Testimonials from '@/components/Testimonials';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // --- SCROLL INTERSECTION OBSERVER ---
    // Sets active navbar section based on viewport intersection
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when section occupies the middle-top area of screen
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const sections = ['home', 'about', 'history', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <main className="flex flex-col w-full bg-white select-none min-h-screen">
      {/* Smart Nav Bar */}
      <Navbar activeSection={activeSection} />

      {/* Page Sections */}
      <Hero />
      <TransitionSection />
      <AboutSection />
      <HistorySection />
      {/* <PortfolioSection /> */}
      <Testimonials />
      <ContactForm />
    </main>
  );
}
