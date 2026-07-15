'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  location: string;
  description: string;
  category: 'joglo' | 'villa' | 'interior' | 'pavilion';
  image: string;
  year: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'Canggu Wooden Sanctuary',
    location: 'Canggu, Bali',
    description: 'A luxurious integration of a restored 150-year-old Javanese Joglo structure into a modern minimalist villa design.',
    category: 'joglo',
    image: '/img/project-1.png',
    year: '2025',
  },
  {
    id: 2,
    title: 'Teakwood Cliffside Pavilions',
    location: 'Uluwatu, Bali',
    description: 'High-end teakwood construction featuring exposed structural joints and traditional thatch roofs overlooking the Indian Ocean.',
    category: 'pavilion',
    image: '/img/project-2.png',
    year: '2024',
  },
  {
    id: 3,
    title: 'Modern Joglo Residence',
    location: 'Seminyak, Bali',
    description: 'An elegant multi-generational family home combining traditional wooden columns (Soko Guru) with floor-to-ceiling glass facades.',
    category: 'joglo',
    image: '/img/project-3.png',
    year: '2025',
  },
  {
    id: 4,
    title: 'Eco-Luxury Bamboo Villa',
    location: 'Ubud, Bali',
    description: 'Custom handcrafted bamboo and ironwood architecture blending seamlessly into the lush terraced jungle landscape of Ubud.',
    category: 'villa',
    image: '/img/project-4.png',
    year: '2023',
  },
  {
    id: 5,
    title: 'Teak Heritage Pavilion',
    location: 'Pererenan, Bali',
    description: 'A beautiful open-air garden pavilion built entirely of premium recycled teak wood for yoga classes and sunset viewing.',
    category: 'pavilion',
    image: '/img/project-5.png',
    year: '2024',
  },
  {
    id: 6,
    title: 'Custom Antique Wood Accents',
    location: 'Bingin, Bali',
    description: 'Intricately hand-carved panels, custom-designed sliding doors, and bespoke architectural wood installations.',
    category: 'interior',
    image: '/img/project-6.png',
    year: '2025',
  },
];

export default function PortfolioSection() {
  const [filter, setFilter] = useState<'all' | 'joglo' | 'villa' | 'interior' | 'pavilion'>('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredProjects = projectsData.filter(
    (p) => filter === 'all' || p.category === filter
  );

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'joglo', name: 'Joglo Restoration' },
    { id: 'villa', name: 'Modern Villas' },
    { id: 'pavilion', name: 'Wooden Pavilions' },
    { id: 'interior', name: 'Bespoke Interior' },
  ];

  return (
    <section id="portfolio" className="py-24 bg-white overflow-hidden w-full flex flex-col gap-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-red-500 uppercase mb-3">
            Selected Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
            Our Architectural<br />
            Portfolio
          </h2>
        </div>
        <p className="text-gray-500 text-sm sm:text-base max-w-md font-medium leading-relaxed">
          From historic Joglo restorations to modern wooden pavilions, explore how we combine premium craftsmanship with timeless aesthetics.
        </p>
      </div>

      {/* Filter Category Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex gap-2 overflow-x-auto pb-4 border-b border-gray-100 scrollbar-none">
          {categories.map((cat) => {
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex flex-col bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100/50 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gray-900/10 z-10 group-hover:bg-gray-900/20 transition-all duration-500" />
                  
                  {/* Subtle placeholder pattern when physical file is missing */}
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600 z-0">
                    <svg className="w-12 h-12 stroke-current opacity-40" viewBox="0 0 24 24" fill="none" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                    </svg>
                  </div>

                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover relative z-10 transition-transform duration-700 ease-out group-hover:scale-110"
                    unoptimized // Allow rendering placeholders without strict local sizing constraints
                  />
                  
                  {/* Category Pill */}
                  <span className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur-md text-gray-900 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                    {project.category}
                  </span>

                  {/* Year Pill */}
                  <span className="absolute top-5 right-5 z-20 bg-black/75 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                    {project.year}
                  </span>
                </div>

                {/* Content Container */}
                <div className="p-8 flex flex-col justify-between flex-grow bg-white relative z-20">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{project.location}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-red-500 transition-colors duration-300 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mt-2 font-normal">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-400 group-hover:text-gray-800 transition-colors">
                      VIEW DETAILS
                    </span>
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Information Banner on Missing Assets (Instruction compatibility) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-6">
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-400 leading-relaxed text-center">
          💡 <strong>Image Assets Note:</strong> Portfolio items load with mapped clean paths (e.g. <code>/img/project-1.png</code>). If assets are not placed in the <code>public/img/</code> folder, standard icons will act as placeholders.
        </div>
      </div>
    </section>
  );
}
