/* ── AdminPage ───────────────────────────────────────────── */
function AdminPage({ messages, onApprove, onReject, onDelete }) {
  const { useState } = React;
  const [pw, setPw]       = useState('');
  const [auth, setAuth]   = useState(false);
  const [err, setErr]     = useState(false);
  const [loading, setLoading] = useState(false);

  const pending  = messages.filter(m => !m.approved);
  const approved = messages.filter(m =>  m.approved);
  const rejected = messages.filter(m =>  m.rejected);

  async function handleLogin() {
    if (!pw.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    if (pw === 'admin123') { setAuth(true); setErr(false); }
    else { setErr(true); setPw(''); }
  }

  /* ── Login screen ── */
  if (!auth) return (
    <main className="page">
      <div className="login-wrap anim-fade-up">
        <div className="login-card">

          <div className="login-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--gold)">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
            </svg>
          </div>

          <h2 className="login-card__title">Admin Access</h2>
          <p className="login-card__sub">Enter your password to manage messages</p>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-input ${err ? 'form-input--error' : ''}`}
              value={pw}
              placeholder="••••••••"
              onChange={e => { setPw(e.target.value); setErr(false); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {err && (
            <div className="toast toast--danger anim-pop" style={{ marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Incorrect password. (Hint: admin123)
            </div>
          )}

          <button
            className="btn btn--gold btn--full"
            onClick={handleLogin}
            disabled={!pw.trim() || loading}
            style={{ marginTop: 4 }}
          >
            {loading && <Spinner />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="form-hint">Demo password: <strong>admin123</strong></p>
        </div>
      </div>
    </main>
  );

  /* ── Admin dashboard ── */
  return (
    <main className="page">
      <div className="container--wide">

        {/* Header */}
        <div className="admin-header anim-fade-up">
          <div>
            <h1 className="admin-header__title">
              Admin <span>Panel</span>
            </h1>
            <p className="admin-header__meta">Manage resident messages</p>
          </div>
          <button className="btn btn--ghost" onClick={() => setAuth(false)}>
            Sign out
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats anim-fade-up-1">
          <div className="stat-card stat-card--gold">
            <div className="stat-card__num">{pending.length}</div>
            <div className="stat-card__label">Pending</div>
          </div>
          <div className="stat-card stat-card--green">
            <div className="stat-card__num">{approved.length}</div>
            <div className="stat-card__label">Published</div>
          </div>
          <div className="stat-card stat-card--red">
            <div className="stat-card__num">{rejected ? rejected.length : 0}</div>
            <div className="stat-card__label">Rejected</div>
          </div>
        </div>

        {/* ── Pending ── */}
        <div className="admin-section anim-fade-up-2">
          <div className="section-label">
            <div className="section-label__dot" style={{ background: 'var(--gold)', animation: 'pulse 2s infinite' }} />
            <span className="section-label__text">Pending Review ({pending.length})</span>
          </div>

          {pending.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 20px' }}>
              <div className="empty-state__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-faint)">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              Inbox clear — no messages awaiting review.
            </div>
          ) : (
            pending.map((m, i) => (
              <div
                key={m.id}
                className="admin-card anim-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <p className="admin-card__text">{m.text}</p>
                <div className="admin-card__actions">
                  <button className="btn btn--success" onClick={() => onApprove(m.id)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    Approve &amp; Publish
                  </button>
                  <button className="btn btn--danger" onClick={() => onReject(m.id)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="divider" />

        {/* ── Published ── */}
        <div className="admin-section anim-fade-up-3">
          <div className="section-label">
            <div className="section-label__dot" style={{ background: 'var(--success)' }} />
            <span className="section-label__text">Published ({approved.length})</span>
          </div>

          {approved.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 20px' }}>
              No published messages yet.
            </div>
          ) : (
            approved.map((m, i) => (
              <div
                key={m.id}
                className="admin-published-card anim-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="admin-published-card__accent" style={{ background: m.color }} />
                <p className="admin-published-card__text">{m.text}</p>
                <button
                  className="btn btn--ghost"
                  style={{ fontSize: 12, padding: '6px 12px', flexShrink: 0 }}
                  onClick={() => onDelete(m.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
