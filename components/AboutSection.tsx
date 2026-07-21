'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
    },
  };

  const jogloVariants = {
    hidden: { opacity: 0, x: -60, scale: 0.92 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1.1,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        delay: 0.1,
      },
    },
  };

  const features = [
    {
      title: 'Atap Ikonik',
      description:
        'Desain bagian atas (tumpang sari) yang megah dan estetik, menampilkan presisi arsitektur tradisional yang sangat menawan.',
      // Distinct source: top-down view of the complete tumpang sari roof lattice
      imageSrc: '/images/Tampak_Atas_pojok_Joglo_Viewport.png',
      cropStyle: { objectPosition: '50% 28%' } as React.CSSProperties,
    },
    {
      title: 'Pondasi Kokoh',
      description:
        'Struktur bawah dirancang sangat kuat dan stabil, menjamin keamanan serta keseimbangan bangunan di segala kondisi lahan.',
      // Distinct source: pillars + umpak (concrete base footings) angled view
      imageSrc: '/images/Tampak_Pillar_Joglo_Viewport.png',
      cropStyle: { objectPosition: '50% 86%' } as React.CSSProperties,
    },
    {
      title: 'Pilar Kayu Solid',
      description:
        'Menggunakan kayu pilihan berkualitas tinggi yang kokoh dan tebal sebagai penyangga utama untuk ketahanan bangunan jangka panjang.',
      // Distinct source: extreme interior close-up of columns and beam joinery
      imageSrc: '/images/Tampak_Tengah_pillar_Joglo_Viewport.png',
      cropStyle: { objectPosition: '40% 52%' } as React.CSSProperties,
    },
  ];

  return (
    <section
      id="about"
      className="relative w-full bg-white overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16 lg:py-24">
        {/* ─── 2-column grid: left = text + Joglo anchor | right = cards ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-14 items-start">

          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN — bold heading + description (top), Joglo model (bottom)
          ══════════════════════════════════════════════════════════════════ */}
          <div className="relative flex flex-col">

            {/* Text block */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={textVariants}
              className="relative z-10 flex flex-col max-w-[520px]"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-black text-gray-900 leading-[1.05] mb-4 sm:mb-5 tracking-tight">
                Casantiqua
              </h2>
              <p className="text-gray-600 text-xs sm:text-[15px] leading-[1.8] font-normal">
                adalah perusahaan jasa konstruksi spesialis yang mendedikasikan diri pada pelestarian
                dan pembangunan Rumah Joglo autentik. Nama kami, yang memadukan unsur hunian (Casa) dan
                nilai klasik (Antiqua), mencerminkan misi kami dalam menghadirkan kemegahan arsitektur
                tradisional ke dalam konteks hunian modern di Bali.
              </p>
            </motion.div>

            {/* Large free-floating Joglo — anchors the bottom-left */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={jogloVariants}
              className="relative pointer-events-none select-none mt-4 sm:mt-6 w-full sm:w-[110%] lg:w-[120%] h-[240px] sm:h-[360px] lg:h-[480px] sm:-ml-8 lg:-ml-12"
            >
              <Image
                src="/images/Tampak_samping_Joglo_Viewport.png"
                alt="Complete Joglo Architectural 3D Model"
                fill
                priority
                className="object-contain object-left-bottom drop-shadow-[0_24px_60px_rgba(0,0,0,0.08)]"
                sizes="(max-width: 1024px) 90vw, 58vw"
              />
            </motion.div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN — three stacked dark feature cards
          ══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5 pt-0 lg:pt-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.012 }}
                className="bg-zinc-800 transition-all duration-300 rounded-2xl p-4 md:p-5 flex flex-row items-center gap-4 md:gap-5 shadow-xl border border-zinc-700/40 group"
              >
                {/* Distinct cropped thumbnail — unique source image per card */}
                <div className="relative w-[80px] h-[80px] md:w-[88px] md:h-[88px] rounded-xl overflow-hidden bg-zinc-700/50 border border-zinc-600/50 flex-shrink-0">
                  <Image
                    src={feature.imageSrc}
                    alt={`${feature.title} close-up`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    style={feature.cropStyle}
                    sizes="88px"
                  />
                </div>

                {/* Card text */}
                <div className="flex flex-col gap-1.5 min-w-0">
                  <h3 className="text-white font-bold text-sm md:text-[15px] tracking-wide leading-snug group-hover:text-red-400 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
