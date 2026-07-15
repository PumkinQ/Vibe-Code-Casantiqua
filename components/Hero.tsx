'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  // Animation variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] as [number, number, number, number], delay: 0.3 },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen relative flex flex-col justify-between pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden bg-white"
    >
      {/* Background/Center 3D Joglo wireframe */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 mt-20"
      >
        <div className="relative w-[110%] h-[80%] sm:w-[90%] sm:h-[90%] md:w-[75%] md:h-[75%] max-w-[900px] aspect-[4/3] opacity-90">
          <Image
            src="/images/joglo_wireframe.png"
            alt="3D Joglo Frame Model"
            fill
            priority
            className="object-contain select-none"
          />
        </div>
      </motion.div>

      {/* Main Grid Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 w-full relative h-full flex-grow items-start md:items-center mt-6"
      >
        {/* Left Column: Heading & Subtitle */}
        <div className="flex flex-col max-w-lg">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
              Casantiqua
            </h1>
            <p className="text-lg sm:text-xl font-bold text-gray-800 tracking-wide mt-1">
              Tempat membuat
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mt-1">
              Joglo
            </h2>
            <p className="text-sm sm:text-base font-medium text-gray-600 tracking-wide mt-2">
              Terbaikmu
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-sm md:text-base leading-relaxed font-normal"
          >
            Jelajahi Portofolio kami untuk melihat proyek-proyek joglo kami sebelumnya.
            Setiap proyek adalah bukti komitmen kami terhadap kualitas dan detail.
          </motion.p>
        </div>

        {/* Right Column: Side description offset to the bottom right for grid balance */}
        <div className="flex flex-col md:items-end justify-end md:h-full md:mt-24">
          <motion.div
            variants={itemVariants}
            className="max-w-xs md:text-right border-l-2 md:border-l-0 md:border-r-2 border-red-500 pl-4 md:pl-0 md:pr-4 py-2"
          >
            <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
              ahli dalam pembangunan joglo yang elegan dan berkualitas tinggi.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full flex justify-center items-center z-10 mt-12 md:mt-0"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 group text-gray-400 hover:text-red-500 transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-xs uppercase tracking-widest font-semibold">
            Scroll Down
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-red-500 transition-colors"
          />
        </a>
      </motion.div>
    </section>
  );
}
