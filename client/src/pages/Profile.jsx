import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { imgUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import toast from 'react-hot-toast';
import {
  FiMail, FiPhone, FiEdit, FiSend,
  FiMessageSquare, FiArrowLeft, FiRefreshCw,
} from 'react-icons/fi';

const STATUS_COLORS = {
  pending:  'badge-pending',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
};

// ── Avatar helper ──────────────────────────────────────────────────────────
function Avatar({ user: u, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '9999px', flexShrink: 0,
      background: '#d1fae5', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontWeight: '700', color: '#065f46',
      fontSize: size * 0.38, overflow: 'hidden',
    }}>
      {u?.avatar
        ? <img src={imgUrl(u.avatar)} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }} />
        : u?.name?.[0]?.toUpperCase()}
    </div>
  );
}

// ── Listing thumbnail helper ───────────────────────────────────────────────
function ListingThumb({ images, size = 64 }) {
  const src = images?.[0]
    ? imgUrl(images[0])
    : 'https://placehold.co/80x80/e2e8f0/64748b?text=No+Img';

  return (
    <img src={src} alt=""
      style={{ width: size, height: size, borderRadius: '0.6rem', objectFit: 'cover', flexShrink: 0, background: '#f3f4f6' }}
      onError={(e) => { e.target.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=No+Img'; }} />
  );
}

// ── Conversation List ──────────────────────────────────────────────────────
function ConvoList({ convos, activeId, onSelect, currentUserId }) {
  if (convos.length === 0) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
        <FiMessageSquare style={{ fontSize: '2rem', display: 'block', margin: '0 auto 0.5rem' }} />
        No conversations yet.<br />
        Click <b>Message &amp; Bargain</b> on any listing.
      </div>
    );
  }

  return (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {convos.map((c) => {
        const other  = c.participants?.find((p) => p._id !== currentUserId);
        const lastMsg = c.messages?.[c.messages.length - 1];
        const unread  = c.messages?.filter((m) => m.sender?._id !== currentUserId && !m.read).length || 0;

        return (
          <div key={c._id} onClick={() => onSelect(c._id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.85rem 1rem', cursor: 'pointer', transition: 'background 0.15s',
              background: activeId === c._id ? '#f0fdf4' : 'transparent',
              borderBottom: '1px solid #f3f4f6',
              borderLeft: `3px solid ${activeId === c._id ? '#059669' : 'transparent'}`,
            }}
            onMouseEnter={(e) => { if (activeId !== c._id) e.currentTarget.style.background = '#f9fafb'; }}
            onMouseLeave={(e) => { if (activeId !== c._id) e.currentTarget.style.background = 'transparent'; }}>

            {/* ✅ Listing thumbnail using imgUrl */}
            <ListingThumb images={c.listing?.images} size={48} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.listing?.title || 'Listing'}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {other?.name}
                {lastMsg ? ` · ${lastMsg.text.slice(0, 28)}${lastMsg.text.length > 28 ? '…' : ''}` : ' · No messages yet'}
              </p>
            </div>

            {unread > 0 && (
              <span style={{ background: '#059669', color: '#fff', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: '700', padding: '0.15rem 0.5rem', flexShrink: 0 }}>
                {unread}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Chat Window ─────────────────────────────────────────────────────────────
function ChatWindow({ convoId, currentUserId, onBack, onConversationsRefresh }) {
  const [convo, setConvo]     = useState(null);
  const [text, setText]       = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef             = useRef(null);
  const pollRef               = useRef(null);   // ✅ polling interval ref

  // ── Fetch conversation ──────────────────────────────────────────────────
  const fetchConvo = useCallback(async (silent = false) => {
    if (!convoId) return;
    try {
      const { data } = await api.get(`/conversations/${convoId}`);
      setConvo((prev) => {
        // Only update if message count changed (avoids unnecessary re-renders)
        if (!prev || prev.messages.length !== data.messages.length) {
          return data;
        }
        // Also update if last message read status changed
        const lastPrev = prev.messages[prev.messages.length - 1];
        const lastNew  = data.messages[data.messages.length - 1];
        if (lastPrev && lastNew && lastPrev.read !== lastNew.read) return data;
        return prev;
      });
    } catch {
      if (!silent) toast.error('Failed to load conversation');
    }
  }, [convoId]);

  // ── Start / stop polling every 3 seconds ───────────────────────────────
  useEffect(() => {
    if (!convoId) {
      setConvo(null);
      return;
    }

    // Initial load
    fetchConvo(false);

    // ✅ Poll every 3 seconds for new messages
    pollRef.current = setInterval(() => {
      fetchConvo(true);
      // Also refresh conversation list to update unread badges
      if (onConversationsRefresh) onConversationsRefresh();
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [convoId, fetchConvo]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convo?.messages?.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/conversations/${convoId}/messages`, { text });
      setConvo(data);
      setText('');
      if (onConversationsRefresh) onConversationsRefresh();
    } catch {
      toast.error('Failed to send message');
    }
    setSending(false);
  };

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!convoId) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', gap: '0.5rem', padding: '2rem' }}>
        <FiMessageSquare style={{ fontSize: '3rem' }} />
        <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>Select a conversation to start chatting</p>
      </div>
    );
  }

  if (!convo) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  const other = convo.participants?.find((p) => p._id !== currentUserId);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

      {/* Chat header */}
      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', flexShrink: 0 }}>
        <button onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontSize: '1.2rem', padding: '0.2rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <FiArrowLeft />
        </button>

        {/* ✅ Listing thumbnail using imgUrl */}
        <ListingThumb images={convo.listing?.images} size={44} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {convo.listing?.title}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Chat with <b>{other?.name}</b>
            {convo.listing?.rent && ` · ৳${convo.listing.rent.toLocaleString()}/mo`}
          </p>
        </div>

        {/* ✅ Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
          <span style={{ width: '0.5rem', height: '0.5rem', background: '#059669', borderRadius: '9999px', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '600' }}>Live</span>
        </div>

        {convo.listing?.negotiable && (
          <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.68rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '9999px', flexShrink: 0 }}>
            Negotiable
          </span>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: '#f9fafb' }}>
        {convo.messages?.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', marginTop: '2rem' }}>
            No messages yet. Say hello! 👋
          </div>
        )}

        {convo.messages?.map((m) => {
          const isMine = m.sender?._id === currentUserId;
          return (
            <div key={m._id}
              style={{ display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '0.5rem' }}>

              {!isMine && <Avatar user={m.sender} size={28} />}

              <div style={{ maxWidth: '70%' }}>
                <div style={{
                  background:    isMine ? '#059669' : '#ffffff',
                  color:         isMine ? '#ffffff' : '#1f2937',
                  borderRadius:  isMine ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                  padding:       '0.6rem 0.9rem',
                  fontSize:      '0.88rem',
                  lineHeight:    '1.5',
                  boxShadow:     '0 1px 3px rgba(0,0,0,0.06)',
                  wordBreak:     'break-word',
                }}>
                  {m.text}
                </div>
                <p style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: '0.2rem', textAlign: isMine ? 'right' : 'left' }}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMine && (
                    <span style={{ marginLeft: '0.3rem', color: m.read ? '#059669' : '#9ca3af' }}>
                      {m.read ? ' ✓✓' : ' ✓'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend}
        style={{ padding: '0.75rem 1rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem', background: '#fff', alignItems: 'flex-end', flexShrink: 0 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          style={{ flex: 1, border: '1.5px solid #e5e7eb', borderRadius: '0.75rem', padding: '0.65rem 0.9rem', fontSize: '0.875rem', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'none', lineHeight: '1.4', maxHeight: '7rem', overflowY: 'auto', transition: 'border-color 0.2s' }}
          onFocus={(e) => (e.target.style.borderColor = '#059669')}
          onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
        />
        <button type="submit" disabled={sending || !text.trim()}
          style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '0.75rem', width: '2.7rem', height: '2.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, transition: 'background 0.2s', opacity: !text.trim() || sending ? 0.5 : 1 }}>
          <FiSend />
        </button>
      </form>
    </div>
  );
}

// ── Main Profile Page ────────────────────────────────────────────────────────
export default function Profile() {
  const { user, updateUser }  = useAuth();
  const [searchParams]        = useSearchParams();

  const initialTab   = searchParams.get('tab')   || 'listings';
  const initialConvo = searchParams.get('convo') || null;

  const [myListings, setMyListings]               = useState([]);
  const [sentRequests, setSentRequests]           = useState([]);
  const [receivedRequests, setReceivedRequests]   = useState([]);
  const [conversations, setConversations]         = useState([]);
  const [activeTab, setActiveTab]                 = useState(initialTab);
  const [activeConvoId, setActiveConvoId]         = useState(initialConvo);
  const [editMode, setEditMode]                   = useState(false);
  const [form, setForm]   = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [avatarFile, setAvatarFile]               = useState(null);
  const [saving, setSaving]                       = useState(false);
  const [unread, setUnread]                       = useState(0);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [l, s, r, c, u] = await Promise.all([
      api.get('/listings/my'),
      api.get('/requests/my'),
      api.get('/requests/received'),
      api.get('/conversations'),
      api.get('/conversations/unread-count'),
    ]);
    setMyListings(l.data);
    setSentRequests(s.data);
    setReceivedRequests(r.data);
    setConversations(c.data);
    setUnread(u.data.count);
  };

  // ✅ Called by ChatWindow polling to refresh conversation list
  const refreshConversations = useCallback(async () => {
    try {
      const [c, u] = await Promise.all([
        api.get('/conversations'),
        api.get('/conversations/unread-count'),
      ]);
      setConversations(c.data);
      setUnread(u.data.count);
    } catch { /* silent */ }
  }, []);

  const handleRequestAction = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      toast.success(`Request ${status}`);
      fetchAll();
    } catch { toast.error('Action failed'); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('phone', form.phone);
      if (avatarFile) fd.append('avatar', avatarFile);
      const { data } = await api.put('/auth/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data);
      toast.success('Profile updated');
      setEditMode(false);
    } catch { toast.error('Update failed'); }
    setSaving(false);
  };

  const tabs = [
    { key: 'listings',  label: `My Listings (${myListings.length})` },
    { key: 'sent',      label: `Sent (${sentRequests.length})` },
    { key: 'received',  label: `Received (${receivedRequests.length})` },
    { key: 'messages',  label: `Messages${unread > 0 ? ` (${unread})` : ''}` },
  ];

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2.5rem 1rem' }}>

      {/* ── Profile Card ────────────────────────────────────── */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
        <div className="avatar avatar-xl">
          {user?.avatar
            ? <img src={imgUrl(user.avatar)} alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }}
                onError={(e) => { e.target.style.display = 'none'; }} />
            : user?.name?.[0]?.toUpperCase()}
        </div>

        {editMode ? (
          <form onSubmit={handleSaveProfile} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '14rem' }}>
            <input value={form.name}  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}  className="form-input" placeholder="Full name" style={{ maxWidth: '18rem' }} />
            <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="form-input" placeholder="Phone" style={{ maxWidth: '18rem' }} />
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} style={{ fontSize: '0.85rem', color: '#6b7280' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937' }}>{user?.name}</h1>
              {user?.role === 'admin' && <span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>Admin</span>}
            </div>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <FiMail style={{ color: '#059669' }} /> {user?.email}
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280', fontSize: '0.875rem' }}>
              <FiPhone style={{ color: '#059669' }} /> {user?.phone}
            </p>
            <button onClick={() => setEditMode(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', color: '#059669', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.75rem', padding: 0, fontFamily: 'Inter, sans-serif' }}>
              <FiEdit /> Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* ── Tab Bar ─────────────────────────────────────────── */}
      <div className="tab-bar" style={{ marginBottom: '1.25rem' }}>
        {tabs.map((t) => (
          <button key={t.key}
            onClick={() => { setActiveTab(t.key); if (t.key !== 'messages') setActiveConvoId(null); }}
            className={`tab-item ${activeTab === t.key ? 'active' : ''}`}
            style={t.key === 'messages' && unread > 0 ? { fontWeight: '700' } : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── My Listings ─────────────────────────────────────── */}
      {activeTab === 'listings' && (
        myListings.length === 0
          ? <div className="empty-state"><div className="empty-icon">🏠</div><h3>No listings yet</h3><p><a href="/create" style={{ color: '#059669' }}>Post your first one!</a></p></div>
          : <div className="listings-grid">{myListings.map((l) => <ListingCard key={l._id} listing={l} />)}</div>
      )}

      {/* ── Sent Requests ───────────────────────────────────── */}
      {activeTab === 'sent' && (
        sentRequests.length === 0
          ? <div className="empty-state"><div className="empty-icon">📬</div><h3>No sent requests yet</h3></div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sentRequests.map((r) => (
                <div key={r._id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
                  {/* ✅ Listing thumbnail using imgUrl */}
                  <ListingThumb images={r.listing?.images} size={60} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: '700', color: '#1f2937', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                      {r.listing?.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      ৳{r.listing?.rent?.toLocaleString()}/mo · {r.listing?.location?.city}
                    </p>
                    {r.message && (
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '0.2rem' }}>
                        "{r.message}"
                      </p>
                    )}
                  </div>
                  <span className={`badge ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
      )}

      {/* ── Received Requests ───────────────────────────────── */}
      {activeTab === 'received' && (
        receivedRequests.length === 0
          ? <div className="empty-state"><div className="empty-icon">📥</div><h3>No received requests yet</h3></div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {receivedRequests.map((r) => (
                <div key={r._id} className="card">
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <Avatar user={r.requester} size={44} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div>
                          <p style={{ fontWeight: '700', color: '#1f2937' }}>{r.requester?.name}</p>
                          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.requester?.phone}</p>
                        </div>
                        <span className={`badge ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        For: <b style={{ color: '#374151' }}>{r.listing?.title}</b>
                      </p>
                      {r.message && <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '0.2rem' }}>"{r.message}"</p>}
                      {r.moveInDate && <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.1rem' }}>Move-in: {new Date(r.moveInDate).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button onClick={() => handleRequestAction(r._id, 'approved')} className="btn btn-primary" style={{ flex: 1, fontSize: '0.875rem' }}>✅ Approve</button>
                      <button onClick={() => handleRequestAction(r._id, 'rejected')} className="btn btn-danger" style={{ flex: 1, fontSize: '0.875rem' }}>❌ Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
      )}

      {/* ── Messages ────────────────────────────────────────── */}
      {activeTab === 'messages' && (
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem', overflow: 'hidden', display: 'flex', height: '34rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>

          {/* Conversation list */}
          <div style={{ width: '17rem', flexShrink: 0, borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9', fontWeight: '700', fontSize: '0.9rem', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>💬 Conversations</span>
              {/* ✅ Manual refresh button */}
              <button onClick={refreshConversations}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}
                title="Refresh conversations">
                <FiRefreshCw />
              </button>
            </div>
            <ConvoList
              convos={conversations}
              activeId={activeConvoId}
              onSelect={(cid) => setActiveConvoId(cid)}
              currentUserId={user?._id}
            />
          </div>

          {/* Chat window — ✅ passes refresh callback so polling updates the list too */}
          <ChatWindow
            convoId={activeConvoId}
            currentUserId={user?._id}
            onBack={() => setActiveConvoId(null)}
            onConversationsRefresh={refreshConversations}
          />
        </div>
      )}

      {/* Pulse animation for live indicator */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}