'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState<'discuss' | 'review'>('discuss');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [discussData, setDiscussData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    subject: '',
    message: '',
  });

  const [reviewData, setReviewData] = useState({
    name: '',
    role: '',
    message: '',
  });

  const handleDiscussChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDiscussData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler for Discuss Project (Form A)
  const handleDiscussSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    if (!discussData.name || !discussData.email || !discussData.whatsapp || !discussData.message) {
      setStatusMsg({ type: 'error', text: 'Semua kolom wajib diisi!' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: discussData.name,
          email: discussData.email,
          whatsapp: discussData.whatsapp,
          subject: discussData.subject,
          message: discussData.message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setDiscussData({ name: '', email: '', whatsapp: '', subject: '', message: '' });
        setShowModal(true); // Open the WhatsApp modal
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

  // Submit handler for Leave a Review (Form B)
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    if (!reviewData.name || !reviewData.message) {
      setStatusMsg({ type: 'error', text: 'Semua kolom wajib diisi!' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewData.name,
          email: 'review@casantiqua.com', // fallback/dummy email to satisfy backend comments API validation
          subject: 'Review',
          message: reviewData.message,
          role: reviewData.role || 'Casantiqua Client',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({
          type: 'success',
          text: 'Pesan terkirim! Komentar Anda berstatus pending dan sedang menunggu moderasi admin.',
        });
        setReviewData({ name: '', role: '', message: '' });
        // Trigger custom event to alert other components that comments list changed
        window.dispatchEvent(new Event('comments-updated'));
      } else {
        setStatusMsg({
          type: 'error',
          text: data.error || 'Gagal mengirim review. Silakan coba lagi.',
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
    <section id="contact" className="py-20 max-w-7xl mx-auto px-6 md:px-12 bg-white relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Form Inquiry */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
              Interested in talking?<br />
              Let’s Do it
            </h2>

            {/* Sliding Toggle Switch */}
            <div className="relative flex items-center bg-gray-100 rounded-full p-1 w-full max-w-[360px] mb-10 select-none">
              <div
                className="absolute top-1 bottom-1 rounded-full bg-gray-900 transition-all duration-300 ease-out"
                style={{
                  left: activeTab === 'discuss' ? '4px' : '50%',
                  right: activeTab === 'discuss' ? '50%' : '4px',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setActiveTab('discuss');
                  setStatusMsg(null);
                }}
                className={`relative z-10 w-1/2 text-center py-2 text-xs font-black tracking-widest uppercase transition-colors duration-300 ${
                  activeTab === 'discuss' ? 'text-white' : 'text-gray-500'
                }`}
              >
                Discuss Project
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('review');
                  setStatusMsg(null);
                }}
                className={`relative z-10 w-1/2 text-center py-2 text-xs font-black tracking-widest uppercase transition-colors duration-300 ${
                  activeTab === 'review' ? 'text-white' : 'text-gray-500'
                }`}
              >
                Leave a Review
              </button>
            </div>

            {/* Form rendering based on activeTab */}
            {activeTab === 'discuss' ? (
              <form onSubmit={handleDiscussSubmit} className="flex flex-col gap-8 w-full">
                {/* Full Name Input */}
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="name"
                    value={discussData.name}
                    onChange={handleDiscussChange}
                    placeholder="Full name"
                    disabled={loading}
                    className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
                  />
                </div>

                {/* Email & WhatsApp Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <input
                      type="email"
                      name="email"
                      value={discussData.email}
                      onChange={handleDiscussChange}
                      placeholder="Email"
                      disabled={loading}
                      className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="tel"
                      name="whatsapp"
                      value={discussData.whatsapp}
                      onChange={handleDiscussChange}
                      placeholder="WhatsApp number"
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
                    value={discussData.subject}
                    onChange={handleDiscussChange}
                    placeholder="Subject"
                    disabled={loading}
                    className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
                  />
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col">
                  <textarea
                    name="message"
                    value={discussData.message}
                    onChange={handleDiscussChange}
                    placeholder="Message"
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
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-8 w-full animate-fade-in">
                {/* Full Name & Role Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="name"
                      value={reviewData.name}
                      onChange={handleReviewChange}
                      placeholder="Full name"
                      disabled={loading}
                      className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="role"
                      value={reviewData.role}
                      onChange={handleReviewChange}
                      placeholder="e.g., Villa Owner in Canggu"
                      disabled={loading}
                      className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Review Textarea */}
                <div className="flex flex-col">
                  <textarea
                    name="message"
                    value={reviewData.message}
                    onChange={handleReviewChange}
                    placeholder="Your review details..."
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

                {/* Submit Review Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 border border-red-400 hover:border-red-500 rounded-full bg-transparent hover:bg-red-50 text-gray-800 text-xs sm:text-sm font-black tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                  </button>
                </div>
              </form>
            )}
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

      {/* Success Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full border border-gray-100 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Thank You!</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                We have received your project details and will reach out to you shortly. You can also contact us directly using the information below:
              </p>
              <div className="w-full flex flex-col gap-4 mb-6">
                <a
                  href="https://wa.me/6282146437439"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50/50 rounded-2xl border border-gray-200/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">WhatsApp</p>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-red-500 transition-colors">+62 821-4643-7439</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200/50 text-left">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Address</p>
                    <p className="text-sm font-bold text-gray-800">Canggu, Bali, Indonesia</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-black tracking-widest transition-all duration-300"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
