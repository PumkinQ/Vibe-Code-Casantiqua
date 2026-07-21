'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  Users,
  Trash2,
  Pencil,
  Check,
  X,
  Phone,
  BarChart3,
  Eye,
  MousePointerClick,
  Send,
  Activity,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Comment } from '@/components/Testimonials';
import { Lead } from '@/app/api/leads/route';
import { AnalyticsData, AnalyticsEvent } from '@/app/api/analytics/route';

// ─── Top-level tab type ───────────────────────────────────────────────────────

type TopTab = 'testimonials' | 'leads' | 'analytics';
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [topTab, setTopTab] = useState<TopTab>('testimonials');
  const [globalMsg, setGlobalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Auto-clear global message after 4 seconds
  useEffect(() => {
    if (!globalMsg) return;
    const t = setTimeout(() => setGlobalMsg(null), 4000);
    return () => clearTimeout(t);
  }, [globalMsg]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-red-500 font-semibold text-xs transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Site
            </Link>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-red-500" />
              Casantiqua Admin
            </h1>
          </div>

          {/* Top Tabs */}
          <div className="flex gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            <TopTabButton
              active={topTab === 'testimonials'}
              onClick={() => setTopTab('testimonials')}
              icon={<MessageSquare className="w-4 h-4" />}
              label="Testimonials"
            />
            <TopTabButton
              active={topTab === 'leads'}
              onClick={() => setTopTab('leads')}
              icon={<Users className="w-4 h-4" />}
              label="Leads"
              badge
            />
            <TopTabButton
              active={topTab === 'analytics'}
              onClick={() => setTopTab('analytics')}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Analytics"
            />
          </div>
        </div>
      </header>

      {/* ─── Global Alert ─── */}
      {globalMsg && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg text-sm font-semibold border transition-all ${
            globalMsg.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {globalMsg.text}
        </div>
      )}

      {/* ─── Body ─── */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        {topTab === 'testimonials' ? (
          <TestimonialsPanel onMsg={setGlobalMsg} />
        ) : topTab === 'leads' ? (
          <LeadsPanel onMsg={setGlobalMsg} />
        ) : (
          <AnalyticsPanel onMsg={setGlobalMsg} />
        )}
      </main>
    </div>
  );
}

// ─── Top Tab Button ───────────────────────────────────────────────────────────

function TopTabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
        active
          ? 'bg-gray-900 text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {icon}
      {label}
      {badge && (
        <span
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500"
          aria-label="Admin only"
        />
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS PANEL
// ─────────────────────────────────────────────────────────────────────────────

function TestimonialsPanel({
  onMsg,
}: {
  onMsg: (m: { type: 'success' | 'error'; text: string }) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/comments');
      if (res.ok) {
        const data = await res.json();
        const sorted = data.sort(
          (a: Comment, b: Comment) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setComments(sorted);
      } else {
        onMsg({ type: 'error', text: 'Failed to load testimonials.' });
      }
    } catch {
      onMsg({ type: 'error', text: 'Connection error.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ── Visibility toggle (approve ↔ rejected) ──
  const handleToggleVisibility = async (comment: Comment) => {
    const newStatus = comment.status === 'approved' ? 'rejected' : 'approved';
    setActioningId(comment.id);
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment.id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === comment.id ? { ...c, status: newStatus } : c))
        );
        onMsg({
          type: 'success',
          text: newStatus === 'approved' ? 'Testimonial is now visible on public page.' : 'Testimonial hidden from public page.',
        });
      } else {
        onMsg({ type: 'error', text: data.error || 'Failed to update visibility.' });
      }
    } catch {
      onMsg({ type: 'error', text: 'Connection error.' });
    } finally {
      setActioningId(null);
    }
  };

  // ── Role editing ──
  const handleUpdateRole = async (id: string, role: string) => {
    setActioningId(id);
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, role: data.comment.role } : c))
        );
        onMsg({ type: 'success', text: 'Role updated successfully.' });
      } else {
        onMsg({ type: 'error', text: data.error || 'Failed to update role.' });
      }
    } catch {
      onMsg({ type: 'error', text: 'Connection error.' });
    } finally {
      setActioningId(null);
    }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial permanently?')) return;
    setActioningId(id);
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        onMsg({ type: 'success', text: 'Testimonial deleted.' });
      } else {
        onMsg({ type: 'error', text: data.error || 'Failed to delete.' });
      }
    } catch {
      onMsg({ type: 'error', text: 'Connection error.' });
    } finally {
      setActioningId(null);
    }
  };

  const filteredComments = comments.filter((c) => filter === 'all' || c.status === filter);

  return (
    <div>
      {/* Sub-header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Manage Testimonials</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Toggle visibility to show/hide on the public page. Edit roles inline.
          </p>
        </div>
        <button
          onClick={fetchComments}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((tab) => {
          const count = comments.filter((c) => tab === 'all' || c.status === tab).length;
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {loading && comments.length === 0 ? (
        <LoadingState label="Loading testimonials..." />
      ) : filteredComments.length === 0 ? (
        <EmptyState label="No testimonials in this category." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredComments.map((comment) => (
            <TestimonialCard
              key={comment.id}
              comment={comment}
              actioning={actioningId === comment.id}
              onToggleVisibility={handleToggleVisibility}
              onUpdateRole={handleUpdateRole}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({
  comment,
  actioning,
  onToggleVisibility,
  onUpdateRole,
  onDelete,
}: {
  comment: Comment;
  actioning: boolean;
  onToggleVisibility: (c: Comment) => void;
  onUpdateRole: (id: string, role: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editingRole, setEditingRole] = useState(false);
  const [roleValue, setRoleValue] = useState(comment.role);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  const cardBorder: Record<string, string> = {
    pending: 'border-yellow-200 ring-1 ring-yellow-100',
    approved: 'border-green-100',
    rejected: 'border-red-100',
  };

  const saveRole = () => {
    setEditingRole(false);
    if (roleValue.trim() !== comment.role) {
      onUpdateRole(comment.id, roleValue.trim());
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border p-6 flex flex-col gap-4 shadow-sm transition-all duration-300 ${
        actioning ? 'opacity-50' : ''
      } ${cardBorder[comment.status] ?? 'border-gray-100'}`}
    >
      {/* Top row: name + status badge */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-900 text-base leading-tight truncate">
            {comment.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{comment.email}</p>
          <p className="text-xs text-gray-300">
            {new Date(comment.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border flex-shrink-0 ${
            statusColors[comment.status]
          }`}
        >
          {comment.status}
        </span>
      </div>

      {/* Role / Title (editable) */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2.5">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest flex-shrink-0">
          Role:
        </span>
        {editingRole ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              autoFocus
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveRole();
                if (e.key === 'Escape') {
                  setEditingRole(false);
                  setRoleValue(comment.role);
                }
              }}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-900 focus:outline-none focus:border-red-400 min-w-0"
            />
            <button
              onClick={saveRole}
              className="p-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setEditingRole(false);
                setRoleValue(comment.role);
              }}
              className="p-1 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-semibold text-gray-700 flex-1 truncate">
              {comment.role}
            </span>
            <button
              onClick={() => setEditingRole(true)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors flex-shrink-0"
              title="Edit role"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Message */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-1">
          Message:
        </span>
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{comment.message}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        {/* Visibility Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Public
          </span>
          <button
            onClick={() => onToggleVisibility(comment)}
            disabled={actioning}
            title={
              comment.status === 'approved' ? 'Visible — click to hide' : 'Hidden — click to show'
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
              comment.status === 'approved' ? 'bg-green-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                comment.status === 'approved' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span
            className={`text-xs font-semibold ${
              comment.status === 'approved' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {comment.status === 'approved' ? 'Visible' : 'Hidden'}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(comment.id)}
          disabled={actioning}
          className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
          title="Delete permanently"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEADS PANEL
// ─────────────────────────────────────────────────────────────────────────────

function LeadsPanel({
  onMsg,
}: {
  onMsg: (m: { type: 'success' | 'error'; text: string }) => void;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        setLeads(await res.json());
      } else {
        onMsg({ type: 'error', text: 'Failed to load leads.' });
      }
    } catch {
      onMsg({ type: 'error', text: 'Connection error.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead permanently?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        onMsg({ type: 'success', text: 'Lead deleted.' });
      } else {
        onMsg({ type: 'error', text: data.error || 'Failed to delete.' });
      }
    } catch {
      onMsg({ type: 'error', text: 'Connection error.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Admin-only banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-6">
        <Users className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-black text-amber-800">Admin Only — Client Leads</p>
          <p className="text-xs text-amber-600">
            These are prospective clients who expressed interest. For outreach purposes only.
          </p>
        </div>
      </div>

      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">
            Interested Leads{' '}
            {!loading && (
              <span className="text-base font-semibold text-gray-400">({leads.length})</span>
            )}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">People who filled in the "I'm Interested" form.</p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && leads.length === 0 ? (
        <LoadingState label="Loading leads..." />
      ) : leads.length === 0 ? (
        <EmptyState label="No leads yet. They will appear here when someone submits the Interest form." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              deleting={deletingId === lead.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Sanitization utility for WhatsApp links
function sanitizeWhatsApp(num: string): string {
  // Remove spaces, dashes, parentheses and other non-digit characters
  let clean = num.replace(/\D/g, '');
  // Convert leading 0 to 62 (Indonesia)
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  }
  return clean;
}

function LeadCard({
  lead,
  deleting,
  onDelete,
}: {
  lead: Lead;
  deleting: boolean;
  onDelete: (id: string) => void;
}) {
  const email = lead.email || (lead.contact && lead.contact.includes('@') ? lead.contact : '');
  const whatsapp = lead.whatsapp || (lead.contact && !lead.contact.includes('@') ? lead.contact : '');

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        deleting ? 'opacity-50' : ''
      }`}
    >
      {/* Name + date */}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 className="font-black text-gray-900 text-base leading-tight truncate">{lead.name}</h3>
          {lead.subject && (
            <p className="text-xs font-semibold text-gray-500 mt-1 truncate">Subject: {lead.subject}</p>
          )}
          <p className="text-xs text-gray-300 mt-0.5">
            {new Date(lead.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border bg-blue-50 text-blue-700 border-blue-200 flex-shrink-0">
          New Lead
        </span>
      </div>

      {/* Contact details display */}
      <div className="flex flex-col gap-2">
        {email && (
          <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-2xl hover:bg-red-50/50 transition-colors group"
          >
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex-shrink-0">Email:</span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-red-500 transition-colors truncate">
              {email}
            </span>
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${sanitizeWhatsApp(whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-2xl hover:bg-green-50/50 transition-colors group"
          >
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex-shrink-0">WA:</span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors truncate">
              {whatsapp}
            </span>
          </a>
        )}
      </div>

      {/* Message */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex-1">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-1">
          Message:
        </span>
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 whitespace-pre-wrap">{lead.message}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
        {email && (
          <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
          >
            Email Client
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${sanitizeWhatsApp(whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
          >
            Chat WhatsApp
          </a>
        )}
        <button
          onClick={() => onDelete(lead.id)}
          disabled={deleting}
          className="ml-auto flex items-center gap-1 px-3 py-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Shared Utility Components ────────────────────────────────────────────────

function LoadingState({ label }: { label: string }) {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-4" />
      <p className="text-gray-400 font-medium text-sm">{label}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 py-16 text-center shadow-sm">
      <p className="text-gray-400 font-semibold">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS PANEL
// ─────────────────────────────────────────────────────────────────────────────

function AnalyticsPanel({
  onMsg,
}: {
  onMsg: (m: { type: 'success' | 'error'; text: string }) => void;
}) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        setData(await res.json());
      } else {
        onMsg({ type: 'error', text: 'Failed to load analytics data.' });
      }
    } catch {
      onMsg({ type: 'error', text: 'Connection error while fetching analytics.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return <LoadingState label="Loading traffic & behavior analytics..." />;
  }

  const pageViews = data?.pageViews || 0;
  const scrollDepth = data?.scrollDepth || 0;
  const engagements = data?.engagements || 0;

  // Percentage calculations
  const scrollRate = pageViews > 0 ? ((scrollDepth / pageViews) * 100).toFixed(1) : '0';
  const conversionRate = pageViews > 0 ? ((engagements / pageViews) * 100).toFixed(1) : '0';

  return (
    <div className="flex flex-col gap-8">
      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            User Engagement Analytics
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Real-time tracking of site visits, footer scroll depth, and form conversion actions.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Primary 3 Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Total Page Views */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Traffic
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Total Page Views
            </span>
            <div className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              {pageViews.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Unique sessions and visits recorded across site routes.
            </p>
          </div>
        </div>

        {/* Stat 2: Scroll Depth */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              {scrollRate}% Depth
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Deep Scroll Engagement
            </span>
            <div className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              {scrollDepth.toLocaleString()}
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Number(scrollRate), 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Users who scrolled all the way to the footer content.
            </p>
          </div>
        </div>

        {/* Stat 3: Total Form Engagements */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {conversionRate}% Conversion
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Total Form Submissions
            </span>
            <div className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              {engagements.toLocaleString()}
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Number(conversionRate), 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Completed Discuss Project or Leave a Review submissions.
            </p>
          </div>
        </div>
      </div>

      {/* Activity Event Stream Log */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-black text-gray-900">Recent Tracking Stream</h3>
            <p className="text-xs text-gray-400">Latest recorded user interaction events</p>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            Showing last {data?.events?.length || 0} events
          </span>
        </div>

        {!data?.events || data.events.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No recorded activity events yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-2 scrollbar-none">
            {data.events.map((evt) => (
              <div key={evt.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <EventBadge type={evt.type} />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {evt.type === 'page_view'
                        ? 'Page View'
                        : evt.type === 'scroll_depth'
                        ? 'Full Scroll to Footer'
                        : 'Form Engagement'}
                    </p>
                    {evt.details && (
                      <p className="text-xs text-gray-400 font-medium">{evt.details}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-mono flex-shrink-0">
                  {new Date(evt.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventBadge({ type }: { type: 'page_view' | 'scroll_depth' | 'engagement' }) {
  if (type === 'page_view') {
    return (
      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
        <Eye className="w-4 h-4" />
      </div>
    );
  }
  if (type === 'scroll_depth') {
    return (
      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
        <MousePointerClick className="w-4 h-4" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
      <Send className="w-4 h-4" />
    </div>
  );
}
