'use client';

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

  const features = [
    {
      title: 'Atap Ikonik',
      description:
        'Desain bagian atas (tumpang sari) yang megah dan estetik, menampilkan presisi arsitektur tradisional yang sangat menawan.',
      // Crop position to show the top (roof) of the wireframe
      cropClass: 'object-top scale-[1.8] translate-y-[20%]',
    },
    {
      title: 'Pondasi Kokoh',
      description:
        'Struktur bawah dirancang sangat kuat dan stabil, menjamin keamanan serta keseimbangan bangunan di segala kondisi lahan.',
      // Crop position to show the bottom (foundation) of the wireframe
      cropClass: 'object-bottom scale-[1.7] -translate-y-[15%]',
    },
    {
      title: 'Pilar Kayu Solid',
      description:
        'Menggunakan kayu pilihan berkualitas tinggi yang kokoh dan tebal sebagai penyangga utama untuk ketahanan bangunan jangka panjang.',
      // Crop position to show the pillars (middle) of the wireframe
      cropClass: 'object-center scale-[1.5] -translate-y-[5%]',
    },
  ];

  return (
    <section
      id="about"
      className="min-h-screen max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col justify-center relative overflow-hidden bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Title & Description & 3D Frame Crop */}
        <div className="flex flex-col h-full justify-between pr-0 lg:pr-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={textVariants}
            className="flex flex-col"
          >
            <span className="text-red-500 font-bold tracking-widest text-sm uppercase mb-2">
              ABOUT US
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
              Casantiqua
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
              adalah perusahaan jasa konstruksi spesialis yang mendedikasikan diri pada pelestarian dan pembangunan Rumah Joglo autentik. Nama kami, yang memadukan unsur hunian (Casa) dan nilai klasik (Antiqua), mencerminkan misi kami dalam menghadirkan kemegahan arsitektur tradisional ke dalam konteks hunian modern di Bali.
            </p>
          </motion.div>

          {/* Wireframe crop at the bottom left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 0.9, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
            className="relative w-full h-[200px] sm:h-[300px] mt-10 pointer-events-none self-start overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50"
          >
            <Image
              src="/images/joglo_wireframe.png"
              alt="Joglo Base Wireframe"
              fill
              className="object-contain object-bottom scale-110 translate-y-6 select-none"
            />
          </motion.div>
        </div>

        {/* Right Column: Stacked dark gray feature cards */}
        <div className="flex flex-col gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-zinc-800 hover:bg-zinc-800/95 transition-all duration-300 rounded-3xl p-6 md:p-8 flex flex-row items-center gap-6 md:gap-8 shadow-lg border border-zinc-700/50 group"
            >
              {/* Left Side: Cropped Thumbnail */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-zinc-700/50 border border-zinc-600 flex-shrink-0">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/joglo_wireframe.png"
                    alt={`${feature.title} details`}
                    fill
                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${feature.cropClass}`}
                  />
                </div>
              </div>

              {/* Right Side: Feature content */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-white font-bold text-lg md:text-xl tracking-wide group-hover:text-red-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
