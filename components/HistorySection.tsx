'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function HistorySection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll positions to hide/show navigation arrows
  const checkScrollLimits = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollLimits);
      // Run once on load
      checkScrollLimits();
    }
    return () => slider?.removeEventListener('scroll', checkScrollLimits);
  }, []);

  // Slide helper
  const slide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.7 : clientWidth * 0.7;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Image data for the gallery carousel
  const images = [
    { src: '/images/Artboard-1-copy.png', alt: "" },
    { src: '/images/Artboard-1-copy-2.png', alt: "" },
    { src: '/images/Artboard-1-copy-3.png', alt: "" },
    { src: '/images/Artboard-1-copy-4.png', alt: "" },
    { src: '/images/Artboard-1-copy-5.png', alt: "" },
    { src: '/images/Artboard-1-copy-6.png', alt: "" },
    { src: '/images/Artboard-1-copy-7.png', alt: "" },
    { src: '/images/Artboard-1-copy-8.png', alt: "" },
    { src: '/images/Artboard-1-copy-9.png', alt: "" },
  ];

  return (
    <section
      id="history"
      className="min-h-screen max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col justify-center bg-white"
    >
      {/* Title */}
      <div className="text-center mb-10">
        <span className="text-red-500 font-bold tracking-widest text-sm uppercase mb-2 block">
          OUR STORY
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
          History
        </h2>
      </div>

      {/* Slider Container with --- SLIDER FADE EFFECT --- */}
      <div className="relative w-full my-8 group">
        {/* Navigation Buttons (Desktop) */}
        {canScrollLeft && (
          <button
            onClick={() => slide('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-100 hover:scale-110 active:scale-95 transition-all duration-300 hidden md:flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => slide('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-100 hover:scale-110 active:scale-95 transition-all duration-300 hidden md:flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {/* Carousel Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pb-6 cursor-grab active:cursor-grabbing scroll-smooth select-none scrollbar-none"
          style={{
            // Apply mask fadeout on the left and right edges (linear-gradient mask-image)
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            scrollSnapType: 'x mandatory',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-[48%] aspect-[16/10] relative rounded-3xl overflow-hidden shadow-md border border-gray-100"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 60vw, 48vw"
                className="object-cover pointer-events-none hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Description under the slider */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-left mt-8 flex flex-col gap-6"
      >
        <p className="text-gray-700 text-base sm:text-lg md:text-xl font-normal leading-relaxed">
          Selamat datang di Casantiqua, tempat di mana keindahan dan keunikan tradisional Joglo bertemu dengan keahlian pembangunan modern.
        </p>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-light">
          Kami adalah tim berdedikasi dengan visi untuk menciptakan ruang yang istimewa dan membangun warisan tradisional yang langgeng.
        </p>
      </motion.div>
    </section>
  );
}
