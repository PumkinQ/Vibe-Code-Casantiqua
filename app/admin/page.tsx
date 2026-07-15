'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, X, Trash2, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { Comment } from '@/components/Testimonials';

export default function AdminDashboard() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- LOGIC: FETCH ALL COMMENTS FOR MODERATION ---
  const fetchComments = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/comments');
      if (res.ok) {
        const data = await res.json();
        // Sort by newest first
        const sorted = data.sort(
          (a: Comment, b: Comment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setComments(sorted);
      } else {
        setMessage({ type: 'error', text: 'Gagal mengambil data komentar dari server.' });
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
      setMessage({ type: 'error', text: 'Koneksi error saat mengambil data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // --- LOGIC: APPROVE / REJECT COMMENT ---
  // Sends a PUT request to /api/comments updating status to 'approved' or 'rejected'.
  // Approved comments are immediately loaded by the homepage Testimonials component.
  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActioningId(id);
    setMessage(null);
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Update local state directly
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus, role: newStatus === 'approved' ? 'Casantiqua Client' : c.role } : c))
        );
        setMessage({
          type: 'success',
          text: `Komentar berhasil di-${newStatus === 'approved' ? 'setujui (Approve)' : 'tolak (Reject)'}!`,
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengubah status komentar.' });
      }
    } catch (error) {
      console.error('Update status error:', error);
      setMessage({ type: 'error', text: 'Koneksi error. Gagal memperbarui status.' });
    } finally {
      setActioningId(null);
    }
  };

  // --- LOGIC: PERMANENTLY DELETE COMMENT ---
  // Sends a DELETE request to /api/comments?id=...
  const handleDeleteComment = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini secara permanen?')) return;
    setActioningId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        setMessage({ type: 'success', text: 'Komentar berhasil dihapus permanen!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menghapus komentar.' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: 'Koneksi error. Gagal menghapus komentar.' });
    } finally {
      setActioningId(null);
    }
  };

  // Filter comments based on selected category
  const filteredComments = comments.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 font-semibold text-sm transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-red-500" />
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Moderasi komentar masuk untuk testimonial depan Casantiqua
            </p>
          </div>
          <button
            onClick={fetchComments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Global Alert Notification */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl text-sm font-medium border ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Filters and Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200 scrollbar-none">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => {
            const count = comments.filter((c) => tab === 'all' || c.status === tab).length;
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Comment Cards Grid */}
        {loading && comments.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-4" />
            <p className="text-gray-500 font-medium">Memuat daftar komentar...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 py-16 text-center shadow-sm">
            <p className="text-gray-400 font-semibold text-lg">Tidak ada komentar di kategori ini.</p>
            <p className="text-gray-400 text-sm mt-1">Komentar baru dari halaman depan akan masuk ke tab Pending.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-sm transition-all duration-300 ${
                  actioningId === comment.id ? 'opacity-50' : 'opacity-100'
                } ${
                  comment.status === 'pending'
                    ? 'border-yellow-200 ring-2 ring-yellow-100/50'
                    : comment.status === 'approved'
                    ? 'border-green-100'
                    : 'border-red-100'
                }`}
              >
                {/* Comment Metadata */}
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{comment.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{comment.email}</p>
                      <p className="text-xs text-gray-400 font-medium">
                        {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border ${
                        comment.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : comment.status === 'approved'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {comment.status}
                    </span>
                  </div>

                  {/* Subject Line */}
                  <div className="mb-3">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Subject:</span>
                    <p className="text-sm font-semibold text-gray-800">{comment.subject}</p>
                  </div>

                  {/* Main Message content */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-1">Pesan:</span>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.message}</p>
                  </div>
                </div>

                {/* Moderation Action Buttons */}
                <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    {/* Approve Button */}
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(comment.id, 'approved')}
                        disabled={actioningId !== null}
                        className="flex items-center gap-1 px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold tracking-wide shadow-sm hover:scale-[1.03] active:scale-97 transition-all disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    )}
                    
                    {/* Reject Button */}
                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                        disabled={actioningId !== null}
                        className="flex items-center gap-1 px-3.5 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl text-xs font-bold tracking-wide shadow-sm hover:scale-[1.03] active:scale-97 transition-all disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    )}
                  </div>

                  {/* Permanent Delete Button */}
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={actioningId !== null}
                    className="flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                    title="Hapus Permanen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
