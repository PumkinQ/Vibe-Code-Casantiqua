'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  // --- SMART NAVBAR LOGIC ---
  // State to track if navbar is visible (slides up when false)
  const [isVisible, setIsVisible] = useState(true);
  // State to track if navbar has a glassmorphic background (when page is scrolled down)
  const [isScrolled, setIsScrolled] = useState(false);
  // Keep track of the last scroll position to determine scroll direction
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Background styling: add blur/border when scrolled past 20px
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Hide/Show logic (Smart Scroll)
      // Always show at the very top of the page
      if (currentScrollY < 50) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Check if user scrolled down or up
      // We set a minimum threshold of 5px to avoid sensitivity issues (e.g. rubber banding on trackpads)
      const scrollDiff = Math.abs(currentScrollY - lastScrollY);
      if (scrollDiff > 5) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down -> hide navbar
          setIsVisible(false);
        } else {
          // Scrolling up -> show navbar
          setIsVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Smooth scroll handler for anchor links
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Find element position relative to page
      const offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop - 80, // Offset to account for navbar height
        behavior: 'smooth',
      });
    }
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'History', id: 'history' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }} // Elegant springy bezier curve
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, 'home')}
            className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative w-12 h-12 overflow-hidden rounded-full border border-gray-200 bg-white p-1">
              <Image
                src="/images/logo.png"
                alt="Wayan Joglo Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="font-bold text-gray-900 tracking-wide text-lg hidden sm:inline-block">
              CASANTIQUA
            </span>
          </a>

          {/* Navigation Links */}
          <div className="flex gap-8 md:gap-12">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleScrollTo(e, item.id)}
                  className="relative text-gray-800 font-medium hover:text-red-500 transition-colors duration-300 py-1 text-sm md:text-base"
                >
                  {item.name}
                  {/* Subtle active line indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
