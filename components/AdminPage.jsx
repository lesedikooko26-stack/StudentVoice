/* ── AdminPage — username/password + audit log + manage admins ── */
function AdminPage({ messages, auditLog, sessionLog, adminAccounts, currentAdmin, onLogin, onLogout, onApprove, onReject, onDelete, onAddAdmin, onRemoveAdmin }) {
  const { useState } = React;

  /* login form state */
  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [err,       setErr]       = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showPw,    setShowPw]    = useState(false);

  /* dashboard tab */
  const [activeTab, setActiveTab] = useState('pending');

  /* add-admin form state */
  const [newUser,     setNewUser]     = useState('');
  const [newPw,       setNewPw]       = useState('');
  const [newPwConf,   setNewPwConf]   = useState('');
  const [newRole,     setNewRole]     = useState('Resident Admin');
  const [showNewPw,   setShowNewPw]   = useState(false);
  const [addErr,      setAddErr]      = useState('');
  const [addSuccess,  setAddSuccess]  = useState('');
  const [addLoading,  setAddLoading]  = useState(false);
  const [confirmDel,  setConfirmDel]  = useState(null); // username pending delete confirm

  const pending  = messages.filter(m => !m.approved);
  const approved = messages.filter(m =>  m.approved);
  const isSuperAdmin = currentAdmin && currentAdmin.role === 'Super Admin';

  /* ── helpers ─────────────────────────────────────────────── */
  function avatarColor(u) {
    const p = ['#f5c518','#27c97e','#4a9eff','#e8504a','#b06aff','#ff8c42'];
    let h = 0;
    for (let i = 0; i < u.length; i++) h = u.charCodeAt(i) + ((h << 5) - h);
    return p[Math.abs(h) % p.length];
  }
  function getInitials(u) {
    return u.split(/[._\s]/).map(p => p[0]).join('').toUpperCase().slice(0,2);
  }
  function actionStyle(action) {
    if (action === 'approved')     return { bg:'rgba(39,201,126,0.12)',  color:'#27c97e', border:'rgba(39,201,126,0.3)'  };
    if (action === 'rejected')     return { bg:'rgba(232,80,74,0.12)',   color:'#e8504a', border:'rgba(232,80,74,0.3)'   };
    if (action === 'removed')      return { bg:'rgba(245,197,24,0.12)',  color:'#c9a010', border:'rgba(245,197,24,0.3)'  };
    if (action === 'admin_added')  return { bg:'rgba(74,158,255,0.12)',  color:'#4a9eff', border:'rgba(74,158,255,0.3)'  };
    if (action === 'admin_removed')return { bg:'rgba(176,106,255,0.12)', color:'#b06aff', border:'rgba(176,106,255,0.3)' };
    return { bg:'transparent', color:'#aaa', border:'#333' };
  }
  function roleColor(role) {
    if (role === 'Super Admin')    return '#f5c518';
    if (role === 'House Manager')  return '#27c97e';
    if (role === 'Resident Admin') return '#4a9eff';
    return '#aaa';
  }

  /* ── login ───────────────────────────────────────────────── */
  async function handleLogin() {
    if (!username.trim() || !password.trim()) { setErr('Please enter both username and password.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    const match = adminAccounts.find(a => a.username === username.trim().toLowerCase() && a.password === password);
    if (match) { onLogin({ username: match.username, role: match.role, initials: match.initials }); setErr(''); }
    else        { setErr('Incorrect username or password. Please try again.'); setPassword(''); }
  }

  /* ── add admin ───────────────────────────────────────────── */
  async function handleAddAdmin() {
    setAddErr(''); setAddSuccess('');
    const u = newUser.trim().toLowerCase();
    if (!u || !newPw || !newPwConf) { setAddErr('All fields are required.'); return; }
    if (u.length < 3)               { setAddErr('Username must be at least 3 characters.'); return; }
    if (!/^[a-z0-9._]+$/.test(u))   { setAddErr('Username can only contain letters, numbers, dots and underscores.'); return; }
    if (newPw.length < 6)           { setAddErr('Password must be at least 6 characters.'); return; }
    if (newPw !== newPwConf)        { setAddErr('Passwords do not match.'); return; }
    if (adminAccounts.find(a => a.username === u)) { setAddErr(`Username "${u}" is already taken.`); return; }

    setAddLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setAddLoading(false);

    onAddAdmin({ username: u, password: newPw, role: newRole, initials: getInitials(u) });
    setAddSuccess(`Admin "${u}" (${newRole}) added successfully.`);
    setNewUser(''); setNewPw(''); setNewPwConf(''); setNewRole('Resident Admin');
    setTimeout(() => setAddSuccess(''), 5000);
  }

  /* ── remove admin ────────────────────────────────────────── */
  function handleRemoveAdmin(u) {
    onRemoveAdmin(u, currentAdmin);
    setConfirmDel(null);
  }

  /* ════════════════════════════════════════════════════════════
     LOGIN SCREEN
  ════════════════════════════════════════════════════════════ */
  if (!currentAdmin) return (
    <main className="page">
      <div className="login-wrap anim-fade-up">
        <div className="login-card">

          <div className="login-card__icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--gold)">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
            </svg>
          </div>

          <h2 className="login-card__title">Admin Login</h2>
          <p className="login-card__sub">Sign in to manage and moderate resident messages</p>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-icon-wrap">
              <svg className="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
              <input type="text" className={`form-input form-input--icon ${err ? 'form-input--error':''}`}
                value={username} placeholder="e.g. sarah.m" autoComplete="username"
                onChange={e => { setUsername(e.target.value); setErr(''); }}
                onKeyDown={e => e.key==='Enter' && handleLogin()} />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <svg className="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              <input type={showPw?'text':'password'} className={`form-input form-input--icon form-input--icon-right ${err?'form-input--error':''}`}
                value={password} placeholder="••••••••" autoComplete="current-password"
                onChange={e => { setPassword(e.target.value); setErr(''); }}
                onKeyDown={e => e.key==='Enter' && handleLogin()} />
              <button className="pw-toggle" onClick={() => setShowPw(p=>!p)} tabIndex={-1} type="button">
                {showPw
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                }
              </button>
            </div>
          </div>

          {err && (
            <div className="toast toast--danger anim-pop" style={{ marginBottom:14, marginTop:2 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {err}
            </div>
          )}

          <button className="btn btn--gold btn--full" onClick={handleLogin}
            disabled={!username.trim()||!password.trim()||loading} style={{ marginTop:8 }}>
            {loading && <Spinner />}{loading ? 'Signing in…' : 'Sign in'}
          </button>

          {/* Clickable demo accounts */}
          <div className="demo-creds">
            <p className="demo-creds__title">Demo accounts — click to autofill</p>
            <div className="demo-creds__list">
              {adminAccounts.map(a => (
                <button key={a.username} className="demo-creds__item"
                  onClick={() => { setUsername(a.username); setPassword(a.password); setErr(''); }}>
                  <div className="demo-creds__avatar" style={{ background: avatarColor(a.username) }}>
                    {getInitials(a.username)}
                  </div>
                  <div>
                    <span className="demo-creds__name">{a.username}</span>
                    <span className="demo-creds__role">{a.role}</span>
                  </div>
                  <div className="demo-creds__arrow">→</div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );

  /* ════════════════════════════════════════════════════════════
     DASHBOARD
  ════════════════════════════════════════════════════════════ */
  const acColor = avatarColor(currentAdmin.username);

  const activeSessions = (sessionLog || []).filter(s => s.active);

  const tabs = [
    { key:'pending',   label:`Pending (${pending.length})` },
    { key:'published', label:`Published (${approved.length})` },
    ...(isSuperAdmin ? [{ key:'log',      label:'Activity Log'  }] : []),
    ...(isSuperAdmin ? [{ key:'sessions', label:'Sessions'       }] : []),
    ...(isSuperAdmin ? [{ key:'admins',   label:'Manage Admins' }] : []),
  ];

  return (
    <main className="page">
      <div className="container--wide">

        {/* ── Header ── */}
        <div className="admin-header anim-fade-up">
          <div>
            <h1 className="admin-header__title">Admin <span>Panel</span></h1>
            <p className="admin-header__meta">Manage and moderate resident messages</p>
          </div>
          <div className="admin-session">
            <div className="admin-session__badge">
              <div className="admin-session__avatar" style={{ background: acColor }}>
                {currentAdmin.initials}
              </div>
              <div className="admin-session__info">
                <span className="admin-session__name">{currentAdmin.username}</span>
                <span className="admin-session__role" style={{ color: roleColor(currentAdmin.role) }}>
                  {currentAdmin.role}
                </span>
              </div>
            </div>
            <button className="btn btn--ghost" style={{ fontSize:12, padding:'6px 14px' }} onClick={onLogout}>
              Sign out
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="admin-stats anim-fade-up-1">
          <div className="stat-card stat-card--gold">
            <div className="stat-card__num">{pending.length}</div>
            <div className="stat-card__label">Pending</div>
          </div>
          <div className="stat-card stat-card--green">
            <div className="stat-card__num">{approved.length}</div>
            <div className="stat-card__label">Published</div>
          </div>
          <div className="stat-card stat-card--blue">
            <div className="stat-card__num">{adminAccounts.length}</div>
            <div className="stat-card__label">Admins</div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="admin-tabs anim-fade-up-2">
          {tabs.map(t => (
            <button key={t.key}
              className={`admin-tab ${activeTab===t.key ? 'admin-tab--active':''}`}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
              {(t.key==='admins' || t.key==='log' || t.key==='sessions') && <span className="admin-tab__badge">Super</span>}
            </button>
          ))}
        </div>

        {/* ══ PENDING ══ */}
        {activeTab==='pending' && (
          <div className="admin-section anim-fade-up">
            {pending.length===0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-faint)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                </div>
                Inbox clear — no messages awaiting review.
              </div>
            ) : pending.map((m,i) => (
              <div key={m.id} className="admin-card anim-fade-up" style={{ animationDelay:`${i*0.06}s` }}>
                <div className="admin-card__meta-top">
                  <span className="admin-card__received">Received {m.time==='pending'?'recently':m.time}</span>
                </div>
                <p className="admin-card__text">{m.text}</p>
                <div className="admin-card__actions">
                  <button className="btn btn--success" onClick={() => onApprove(m.id, currentAdmin)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    Approve &amp; Publish
                  </button>
                  <button className="btn btn--danger" onClick={() => onReject(m.id, currentAdmin)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ PUBLISHED ══ */}
        {activeTab==='published' && (
          <div className="admin-section anim-fade-up">
            {approved.length===0 ? (
              <div className="empty-state">No published messages yet.</div>
            ) : approved.map((m,i) => (
              <div key={m.id} className="admin-published-card anim-fade-up" style={{ animationDelay:`${i*0.05}s` }}>
                <div className="admin-published-card__accent" style={{ background: m.color }} />
                <div className="admin-published-card__body">
                  <p className="admin-published-card__text">{m.text}</p>
                  {m.approvedBy && (
                    <div className="admin-published-card__attribution">
                      <div className="attr-avatar" style={{ background: avatarColor(m.approvedBy) }}>
                        {getInitials(m.approvedBy)}
                      </div>
                      <span className="attr-text">
                        Approved by <strong>{m.approvedBy}</strong>{m.approvedAt ? ` · ${m.approvedAt}` : ''}
                      </span>
                    </div>
                  )}
                </div>
                <button className="btn btn--ghost" style={{ fontSize:12, padding:'6px 12px', flexShrink:0 }}
                  onClick={() => onDelete(m.id, currentAdmin)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ══ ACTIVITY LOG ══ */}
        {activeTab==='log' && (
          <div className="admin-section anim-fade-up">
            <p className="log-intro">Full record of every admin action — who did what and when.</p>
            {auditLog.length===0 ? (
              <div className="empty-state">No actions recorded yet.</div>
            ) : auditLog.map((entry,i) => {
              const s = actionStyle(entry.action);
              const col = avatarColor(entry.adminUser);
              return (
                <div key={entry.id} className="log-row anim-fade-up" style={{ animationDelay:`${i*0.04}s` }}>
                  <div className="log-row__line">
                    <div className="log-row__dot" style={{ background: s.color }} />
                    {i < auditLog.length-1 && <div className="log-row__connector" />}
                  </div>
                  <div className="log-row__content">
                    <div className="log-row__header">
                      <div className="log-row__avatar" style={{ background: col }}>{getInitials(entry.adminUser)}</div>
                      <div className="log-row__who">
                        <span className="log-row__username">{entry.adminUser}</span>
                        <span className="log-row__role">{entry.role}</span>
                      </div>
                      <span className="log-row__action-badge"
                        style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                        {entry.action.replace('_',' ')}
                      </span>
                      <span className="log-row__time">{entry.timestamp}</span>
                    </div>
                    <p className="log-row__snippet">"{entry.msgSnippet}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ SESSIONS (Super Admin only) ══ */}
        {activeTab==='sessions' && isSuperAdmin && (
          <div className="admin-section anim-fade-up">

            {/* Live sessions banner */}
            {activeSessions.length > 0 && (
              <div className="sessions-live-banner">
                <span className="sessions-live-dot" />
                <span className="sessions-live-text">
                  {activeSessions.length} admin{activeSessions.length > 1 ? 's' : ''} currently online
                </span>
              </div>
            )}

            <p className="log-intro">
              Full login history — who accessed the admin panel, when they signed in, and when they signed out.
            </p>

            {/* Filter row */}
            {(() => {
              const { useState: useSt } = React;
              return null; // placeholder — filter handled inline below
            })()}

            {!sessionLog || sessionLog.length === 0 ? (
              <div className="empty-state">No sessions recorded yet.</div>
            ) : sessionLog.map((s, i) => {
              const col = avatarColor(s.adminUser);
              return (
                <div key={s.id} className="session-row anim-fade-up" style={{ animationDelay:`${i*0.04}s` }}>

                  {/* Left: avatar + who */}
                  <div className="session-row__left">
                    <div className="session-row__avatar-wrap">
                      <div className="session-row__avatar" style={{ background: col }}>
                        {getInitials(s.adminUser)}
                      </div>
                      {s.active && <span className="session-row__online-dot" />}
                    </div>
                    <div className="session-row__who">
                      <span className="session-row__username">{s.adminUser}</span>
                      <span className="session-row__role" style={{ color: roleColor(s.role) }}>{s.role}</span>
                    </div>
                  </div>

                  {/* Middle: login / logout times */}
                  <div className="session-row__times">
                    <div className="session-row__time-item">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--success)">
                        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                      <span className="session-row__time-label">In</span>
                      <span className="session-row__time-val">{s.loginAt}</span>
                    </div>
                    <div className="session-row__time-item">
                      {s.active ? (
                        <>
                          <span className="session-row__active-pill">● Active now</span>
                        </>
                      ) : (
                        <>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--text-muted)">
                            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          </svg>
                          <span className="session-row__time-label">Out</span>
                          <span className="session-row__time-val">{s.logoutAt || '—'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: duration badge */}
                  <div className="session-row__right">
                    {s.active ? (
                      <span className="session-row__duration session-row__duration--active">Live</span>
                    ) : (
                      <span className="session-row__duration">{s.duration || '—'}</span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ══ MANAGE ADMINS (Super Admin only) ══ */}
        {activeTab==='admins' && isSuperAdmin && (
          <div className="admin-section anim-fade-up">

            {/* ── Current admins list ── */}
            <div className="manage-admins__section">
              <div className="section-label" style={{ marginBottom:16 }}>
                <div className="section-label__dot" style={{ background:'var(--gold)' }} />
                <span className="section-label__text">Current Admins ({adminAccounts.length})</span>
              </div>

              <div className="admins-list">
                {adminAccounts.map((a,i) => {
                  const col = avatarColor(a.username);
                  const isSelf = a.username === currentAdmin.username;
                  const isLast = adminAccounts.filter(x => x.role==='Super Admin').length===1 && a.role==='Super Admin';
                  return (
                    <div key={a.username} className="admin-row anim-fade-up" style={{ animationDelay:`${i*0.05}s` }}>
                      <div className="admin-row__avatar" style={{ background: col }}>
                        {getInitials(a.username)}
                      </div>
                      <div className="admin-row__info">
                        <div className="admin-row__name">
                          {a.username}
                          {isSelf && <span className="admin-row__you-badge">You</span>}
                        </div>
                        <span className="admin-row__role" style={{ color: roleColor(a.role) }}>{a.role}</span>
                      </div>
                      {/* Remove button — can't remove yourself or last super admin */}
                      {!isSelf && !isLast ? (
                        confirmDel === a.username ? (
                          <div className="admin-row__confirm">
                            <span className="admin-row__confirm-text">Remove {a.username}?</span>
                            <button className="btn btn--danger" style={{ fontSize:12, padding:'5px 12px' }}
                              onClick={() => handleRemoveAdmin(a.username)}>Yes, remove</button>
                            <button className="btn btn--ghost" style={{ fontSize:12, padding:'5px 12px' }}
                              onClick={() => setConfirmDel(null)}>Cancel</button>
                          </div>
                        ) : (
                          <button className="btn btn--ghost admin-row__remove" onClick={() => setConfirmDel(a.username)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                            Remove
                          </button>
                        )
                      ) : (
                        <span className="admin-row__protected">
                          {isSelf ? 'Logged in' : 'Protected'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="divider" />

            {/* ── Add new admin form ── */}
            <div className="manage-admins__section">
              <div className="section-label" style={{ marginBottom:20 }}>
                <div className="section-label__dot" style={{ background:'var(--success)' }} />
                <span className="section-label__text">Add New Admin</span>
              </div>

              <div className="add-admin-form">

                {/* Row 1: username + role */}
                <div className="add-admin-form__row">
                  <div className="form-group" style={{ flex:1 }}>
                    <label className="form-label">Username</label>
                    <div className="input-icon-wrap">
                      <svg className="input-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                      <input type="text" className={`form-input form-input--icon ${addErr?'form-input--error':''}`}
                        value={newUser} placeholder="e.g. john.d"
                        onChange={e => { setNewUser(e.target.value); setAddErr(''); }} />
                    </div>
                  </div>

                  <div className="form-group" style={{ flex:1 }}>
                    <label className="form-label">Role</label>
                    <div className="input-icon-wrap">
                      <svg className="input-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/>
                      </svg>
                      <select className="form-input form-input--icon form-select"
                        value={newRole} onChange={e => setNewRole(e.target.value)}>
                        <option>Resident Admin</option>
                        <option>House Manager</option>
                        {isSuperAdmin && <option>Super Admin</option>}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 2: password + confirm */}
                <div className="add-admin-form__row">
                  <div className="form-group" style={{ flex:1 }}>
                    <label className="form-label">Password</label>
                    <div className="input-icon-wrap">
                      <svg className="input-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                      </svg>
                      <input type={showNewPw?'text':'password'} className={`form-input form-input--icon form-input--icon-right ${addErr?'form-input--error':''}`}
                        value={newPw} placeholder="Min. 6 characters"
                        onChange={e => { setNewPw(e.target.value); setAddErr(''); }} />
                      <button className="pw-toggle" onClick={() => setShowNewPw(p=>!p)} tabIndex={-1} type="button">
                        {showNewPw
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        }
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ flex:1 }}>
                    <label className="form-label">Confirm Password</label>
                    <div className="input-icon-wrap">
                      <svg className="input-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      <input type={showNewPw?'text':'password'} className={`form-input form-input--icon ${addErr&&newPw!==newPwConf?'form-input--error':''}`}
                        value={newPwConf} placeholder="Re-enter password"
                        onChange={e => { setNewPwConf(e.target.value); setAddErr(''); }} />
                    </div>
                  </div>
                </div>

                {/* Password strength indicator */}
                {newPw.length > 0 && (
                  <div className="pw-strength">
                    {['Weak','Fair','Good','Strong'].map((label,idx) => {
                      const score = newPw.length >= 10 && /[A-Z]/.test(newPw) && /[0-9]/.test(newPw) ? 3
                        : newPw.length >= 8 ? 2 : newPw.length >= 6 ? 1 : 0;
                      const colors = ['#e8504a','#ff8c42','#f5c518','#27c97e'];
                      return (
                        <div key={label} className="pw-strength__bar"
                          style={{ background: idx<=score ? colors[score] : 'var(--navy-border)' }} />
                      );
                    })}
                    <span className="pw-strength__label" style={{
                      color: newPw.length>=10&&/[A-Z]/.test(newPw)&&/[0-9]/.test(newPw)?'#27c97e'
                        : newPw.length>=8?'#f5c518' : newPw.length>=6?'#ff8c42' : '#e8504a'
                    }}>
                      {newPw.length>=10&&/[A-Z]/.test(newPw)&&/[0-9]/.test(newPw)?'Strong'
                        : newPw.length>=8?'Good' : newPw.length>=6?'Fair' : 'Weak'}
                    </span>
                  </div>
                )}

                {addErr && (
                  <div className="toast toast--danger anim-pop" style={{ marginBottom:0, marginTop:4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    {addErr}
                  </div>
                )}

                {addSuccess && (
                  <div className="toast toast--success anim-pop" style={{ marginBottom:0, marginTop:4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    {addSuccess}
                  </div>
                )}

                <button className="btn btn--gold" onClick={handleAddAdmin}
                  disabled={!newUser.trim()||!newPw||!newPwConf||addLoading}
                  style={{ marginTop:16, width:'100%', justifyContent:'center' }}>
                  {addLoading && <Spinner />}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  {addLoading ? 'Adding admin…' : 'Add Admin Account'}
                </button>

              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
