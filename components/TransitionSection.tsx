'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function TransitionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax / gate sliding effect:
  // Left image slides to the left as we scroll down
  const leftX = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '-30%']);
  // Right image slides to the right as we scroll down
  const rightX = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '30%']);
  // Text scales up and fades in
  const textScale = useTransform(scrollYProgress, [0.1, 0.45], [0.8, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0.2, 1]);

  return (
    <section
      ref={containerRef}
      className="h-[70vh] md:h-screen w-full relative flex items-center justify-center overflow-hidden bg-white py-16 border-t border-b border-gray-50"
    >
      {/* Left side 3D model frame (sliding left) */}
      <motion.div
        style={{ x: leftX }}
        className="absolute left-[-15%] sm:left-[-10%] md:left-[-5%] w-[45%] h-[80%] pointer-events-none z-10"
      >
        <div className="relative w-full h-full opacity-60">
          <Image
            src="/images/joglo_wireframe.png"
            alt="Joglo Frame Left"
            fill
            className="object-contain object-left select-none scale-150 origin-left"
          />
        </div>
      </motion.div>

      {/* Center Typography */}
      <motion.div
        style={{ scale: textScale, opacity: textOpacity }}
        className="text-center z-20 px-6 max-w-xl flex flex-col items-center"
      >
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-500 italic font-serif leading-none">
          What is
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight mt-2 sm:mt-4 leading-none">
          Casantiqua?
        </h2>
      </motion.div>

      {/* Right side 3D model frame (sliding right) */}
      <motion.div
        style={{ x: rightX }}
        className="absolute right-[-15%] sm:right-[-10%] md:right-[-5%] w-[45%] h-[80%] pointer-events-none z-10"
      >
        <div className="relative w-full h-full opacity-60">
          <Image
            src="/images/joglo_wireframe.png"
            alt="Joglo Frame Right"
            fill
            className="object-contain object-right select-none scale-150 origin-right"
          />
        </div>
      </motion.div>
    </section>
  );
}
