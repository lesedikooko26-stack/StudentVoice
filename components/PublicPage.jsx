/* ── PublicPage ──────────────────────────────────────────── */
function PublicPage({ messages, onSubmit }) {
  const { useState } = React;
  const [text, setText]     = useState('');
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [votes, setVotes]   = useState({});

  const approved = messages.filter(m => m.approved);

  async function handleSend() {
    if (!text.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onSubmit(text.trim());
    setText('');
    setLoading(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  function handleVote(id) {
    setVotes(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
  }

  return (
    <main className="page">
      <div className="container">

        {/* ── Hero ── */}
        <div className="hero anim-fade-up">
          <div className="hero__badge">
            <div className="hero__badge-dot" />
            <span className="hero__badge-text">Student Voice Board</span>
          </div>
          <h1 className="hero__title">
            Speak up,<br /><span>stay anonymous.</span>
          </h1>
          <p className="hero__subtitle">
            Share feedback, ideas, or concerns about your accommodation.
            Every message is reviewed before it goes live.
          </p>
        </div>

        {/* ── Compose ── */}
        <div className="compose anim-fade-up-1">
          <div className="compose__header">
            <div className="compose__avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-faint)">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <span className="compose__label">
              Posting as <strong>Anonymous Resident</strong>
            </span>
          </div>

          <textarea
            className="compose__textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="What's on your mind? Share feedback, a question, or a suggestion…"
            maxLength={280}
          />

          <div className="compose__footer">
            <span className="compose__count">{text.length} / 280 · Ctrl+Enter to send</span>
            <button
              className="btn btn--gold"
              onClick={handleSend}
              disabled={!text.trim() || loading}
            >
              {loading && <Spinner />}
              {loading ? 'Sending…' : 'Send anonymously'}
            </button>
          </div>
        </div>

        {/* ── Success toast ── */}
        {sent && (
          <div className="toast toast--success anim-pop">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            Message received! It will appear once approved by the admin.
          </div>
        )}

        {/* ── Wall ── */}
        <div className="wall__header anim-fade-up-2">
          <span className="wall__title">Posted messages</span>
          <span className="wall__count">{approved.length} message{approved.length !== 1 ? 's' : ''}</span>
        </div>

        {approved.length === 0 ? (
          <div className="empty-state anim-fade-up-3">
            <div className="empty-state__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-faint)">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            No messages posted yet. Be the first to say something!
          </div>
        ) : (
          <div className="wall">
            {approved.map((m, i) => (
              <MessageCard
                key={m.id}
                msg={{ ...m, voted: !!votes[m.id], votes: m.votes + (votes[m.id] ? 1 : 0) }}
                index={i}
                onVote={handleVote}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
