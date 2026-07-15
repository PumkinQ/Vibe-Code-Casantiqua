'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface Comment {
  id: string;
  name: string;
  role: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch comments from database on mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/comments');
        if (res.ok) {
          const data = await res.json();
          // Filter to only show approved comments
          const approved = data.filter((c: Comment) => c.status === 'approved');
          setTestimonials(approved);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();

    // Listen for custom event to refresh comments when user submits a new one or admin edits it
    window.addEventListener('comments-updated', fetchTestimonials);
    return () => window.removeEventListener('comments-updated', fetchTestimonials);
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  // --- INFINITE MARQUEE LOGIC ---
  // To make the marquee infinite and scroll seamlessly, the items must fill a width
  // larger than the viewport. We duplicate the array multiple times (e.g. 5x) so there is
  // always an item entering the screen as another leaves, preventing empty gaps.
  const getRepeatedTestimonials = (items: Comment[], factor = 6) => {
    if (items.length === 0) return [];
    let result: Comment[] = [];
    for (let i = 0; i < factor; i++) {
      result = [...result, ...items];
    }
    return result;
  };

  const row1Testimonials = getRepeatedTestimonials(testimonials);
  // For variety, reverse the order or shift it slightly for Row 2
  const row2Testimonials = getRepeatedTestimonials([...testimonials].reverse());

  return (
    <section className="py-16 bg-white overflow-hidden w-full flex flex-col gap-6">
      {/* Title */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-6">
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
          Client Experience
        </h2>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center text-gray-500 py-10 font-medium">
          Belum ada testimoni yang disetujui.
        </div>
      ) : (
        /* Marquee Container with pause-on-hover logic */
        <div className="marquee-container flex flex-col gap-8 w-full select-none cursor-default">
          {/* Row 1: Right to Left scrolling */}
          <div className="flex overflow-hidden w-full relative">
            <div className="animate-marquee flex gap-6">
              {row1Testimonials.map((item, index) => (
                <TestimonialCard key={`row1-${item.id}-${index}`} item={item} />
              ))}
            </div>
            {/* Fade overlays on edges */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </div>

          {/* Row 2: Left to Right scrolling */}
          <div className="flex overflow-hidden w-full relative">
            <div className="animate-marquee-reverse flex gap-6">
              {row2Testimonials.map((item, index) => (
                <TestimonialCard key={`row2-${item.id}-${index}`} item={item} />
              ))}
            </div>
            {/* Fade overlays on edges */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </div>
        </div>
      )}
    </section>
  );
}

// Single Testimonial Card Component
function TestimonialCard({ item }: { item: Comment }) {
  return (
    <div className="w-[300px] sm:w-[380px] flex-shrink-0 bg-gray-100 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between hover:bg-gray-200/80 hover:scale-[1.01] transition-all duration-300 shadow-sm border border-gray-200/20">
      {/* Top Section: Client details */}
      <div className="flex gap-4 items-center mb-4">
        {/* Profile Circle Icon */}
        <div className="w-8 h-8 rounded-full bg-zinc-500 flex-shrink-0" />
        <div className="flex flex-col">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
            {item.name}
          </h4>
          <span className="text-xs text-gray-500 font-medium">
            {item.role}
          </span>
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-normal flex-grow line-clamp-4">
        {item.message}
      </p>
    </div>
  );
}
