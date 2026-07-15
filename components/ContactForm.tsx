'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- COMMENT SUBMISSION & MODERATION SYSTEM LOGIC ---
  // Submitting this form sends the message to /api/comments.
  // The API stores this message in comments.json with a status of 'pending'.
  // It will NOT be shown on the home page testimonials until approved by the admin in `/admin`.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    // Validate email simple
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMsg({ type: 'error', text: 'Semua kolom wajib diisi!' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({
          type: 'success',
          text: 'Pesan terkirim! Komentar Anda berstatus pending dan sedang menunggu moderasi admin.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Trigger custom event to alert other components that comments list changed
        window.dispatchEvent(new Event('comments-updated'));
      } else {
        setStatusMsg({
          type: 'error',
          text: data.error || 'Gagal mengirim pesan. Silakan coba lagi.',
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setStatusMsg({
        type: 'error',
        text: 'Koneksi error. Gagal menghubungi server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 max-w-7xl mx-auto px-6 md:px-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Form Inquiry */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
              Interested in talking?<br />
              Let’s Do it
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    disabled={loading}
                    className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    disabled={loading}
                    className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div className="flex flex-col">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  disabled={loading}
                  className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
                />
              </div>

              {/* Message (Textarea, labeled "Subject" as in design) */}
              <div className="flex flex-col">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Subject" // Matching design mockup placeholder
                  disabled={loading}
                  rows={4}
                  className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300 resize-none"
                />
              </div>

              {/* Status Message Display */}
              {statusMsg && (
                <div
                  className={`text-sm font-medium p-4 rounded-2xl ${
                    statusMsg.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              {/* Discuss Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 border border-red-400 hover:border-red-500 rounded-full bg-transparent hover:bg-red-50 text-gray-800 text-xs sm:text-sm font-black tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'SENDING...' : 'DISCUSS PROJECT'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Contact Details */}
        <div className="lg:col-span-5 flex flex-col justify-between pt-4 lg:pt-16 lg:pl-8">
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                Get in touch
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mt-1 hover:text-red-500 transition-colors">
                Casantiqua@gmail.com
              </h3>
            </div>

            <div className="flex flex-col gap-1 text-gray-700 font-medium text-sm sm:text-base">
              <p>+62 821-4643-7439</p>
              <p className="text-gray-500 font-light">Canggu, Bali, Indonesia</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 mt-12 lg:mt-0 text-sm font-semibold text-gray-600">
            <a
              href="https://wa.me/6282146437439"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors"
            >
              Whatsapp
            </a>
            <a
              href="https://instagram.com/casantiqua"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
