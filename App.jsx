/* ================================================================
   App.jsx — Student Voice | My Student House
   Root component: holds all state, passes props to pages.
   ================================================================ */

const { useState } = React;

/* ── Seed data ─────────────────────────────────────────────── */
let nextId = 9;

const CARD_COLORS = [
  '#f5c518', '#27c97e', '#4a9eff', '#e8504a',
  '#b06aff', '#ff8c42', '#00d4b4', '#ff6b9d',
];

/* ── Admin accounts (in production replace with backend auth) ── */
const INITIAL_ADMIN_ACCOUNTS = [
  { username: 'admin',      password: 'admin123',  role: 'Super Admin',    initials: 'SA' },
  { username: 'sarah.m',    password: 'sarah456',  role: 'House Manager',  initials: 'SM' },
  { username: 'thabo.k',    password: 'thabo789',  role: 'Resident Admin', initials: 'TK' },
];

const SEED_MESSAGES = [
  {
    id: 1,
    text: "The communal kitchen on floor 2 needs a proper cleaning schedule. It's been left messy most evenings this week.",
    time: '2h ago',
    color: '#f5c518',
    approved: true,
    votes: 14,
    approvedBy: 'sarah.m',
    approvedAt: '2h ago',
  },
  {
    id: 2,
    text: "WiFi keeps dropping after 9pm on weeknights. Please can someone check the router on the 3rd floor? It's affecting studying.",
    time: '5h ago',
    color: '#4a9eff',
    approved: true,
    votes: 31,
    approvedBy: 'thabo.k',
    approvedAt: '4h ago',
  },
  {
    id: 3,
    text: "Can we get a proper notice board in the common room for announcements? Would really help residents stay informed.",
    time: '1d ago',
    color: '#27c97e',
    approved: true,
    votes: 9,
    approvedBy: 'admin',
    approvedAt: '1d ago',
  },
  {
    id: 4,
    text: "Hot water was ice cold again this morning — fourth time this month. Please escalate this urgently!",
    time: '1d ago',
    color: '#e8504a',
    approved: true,
    votes: 42,
    approvedBy: 'sarah.m',
    approvedAt: '23h ago',
  },
  {
    id: 5,
    text: "Would love a group study session organised in the common room before June exams. Anyone keen?",
    time: '2d ago',
    color: '#b06aff',
    approved: true,
    votes: 7,
    approvedBy: 'thabo.k',
    approvedAt: '2d ago',
  },
  { id: 6, text: "The laundry machines on floor 3 have been broken for over two weeks. Can maintenance please come check?", time: 'pending', color: '#ff8c42', approved: false, votes: 0 },
  { id: 7, text: "Parking area gate was left open all of last weekend. Security should be notified.", time: 'pending', color: '#00d4b4', approved: false, votes: 0 },
  { id: 8, text: "Can we please have a movie night in the common room? I'll bring popcorn if someone organises it 🍿", time: 'pending', color: '#ff6b9d', approved: false, votes: 0 },
];

/* Seed audit log entries */
const SEED_LOG = [
  { id: 1, adminUser: 'sarah.m',  role: 'House Manager',  action: 'approved', msgSnippet: 'The communal kitchen on floor 2…', timestamp: '2h ago' },
  { id: 2, adminUser: 'thabo.k',  role: 'Resident Admin', action: 'approved', msgSnippet: 'WiFi keeps dropping after 9pm…',    timestamp: '4h ago' },
  { id: 3, adminUser: 'admin',    role: 'Super Admin',    action: 'approved', msgSnippet: 'Can we get a proper notice board…', timestamp: '1d ago' },
  { id: 4, adminUser: 'sarah.m',  role: 'House Manager',  action: 'rejected', msgSnippet: 'Someone keeps stealing food…',      timestamp: '1d ago' },
  { id: 5, adminUser: 'thabo.k',  role: 'Resident Admin', action: 'approved', msgSnippet: 'Would love a group study session…', timestamp: '2d ago' },
  { id: 6, adminUser: 'admin',    role: 'Super Admin',    action: 'removed',  msgSnippet: 'Offensive content removed…',        timestamp: '3d ago' },
];

/* ── Seed session log — historical logins for demo ─────────── */
const SEED_SESSIONS = [
  { id: 1, adminUser: 'sarah.m',  role: 'House Manager',  loginAt: '07:42, 06 May', logoutAt: '09:15, 06 May', duration: '1h 33m', active: false },
  { id: 2, adminUser: 'thabo.k',  role: 'Resident Admin', loginAt: '08:05, 06 May', logoutAt: '10:30, 06 May', duration: '2h 25m', active: false },
  { id: 3, adminUser: 'admin',    role: 'Super Admin',    loginAt: '09:00, 05 May', logoutAt: '11:00, 05 May', duration: '2h 00m', active: false },
  { id: 4, adminUser: 'sarah.m',  role: 'House Manager',  loginAt: '14:20, 05 May', logoutAt: '15:05, 05 May', duration: '45m',    active: false },
  { id: 5, adminUser: 'thabo.k',  role: 'Resident Admin', loginAt: '16:00, 04 May', logoutAt: '16:48, 04 May', duration: '48m',    active: false },
  { id: 6, adminUser: 'admin',    role: 'Super Admin',    loginAt: '10:30, 03 May', logoutAt: '12:15, 03 May', duration: '1h 45m', active: false },
];

let nextLogId = 7;
let nextSessionId = 7;

function nowStamp() {
  return new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) +
    ', ' + new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

/* ── Root App ──────────────────────────────────────────────── */
function App() {
  const [activePage,    setActivePage]    = useState('public');
  const [messages,      setMessages]      = useState(SEED_MESSAGES);
  const [auditLog,      setAuditLog]      = useState(SEED_LOG);
  const [sessionLog,    setSessionLog]    = useState(SEED_SESSIONS);
  const [adminAccounts, setAdminAccounts] = useState(INITIAL_ADMIN_ACCOUNTS);
  const [currentAdmin,  setCurrentAdmin]  = useState(null);
  /* track the active session id so we can close it on logout */
  const [activeSessionId, setActiveSessionId] = useState(null);

  function addLog(admin, action, msgText) {
    setAuditLog(prev => [{
      id:         nextLogId++,
      adminUser:  admin.username,
      role:       admin.role,
      action,
      msgSnippet: msgText.length > 48 ? msgText.slice(0, 48) + '…' : msgText,
      timestamp:  nowStamp(),
    }, ...prev]);
  }

  function handleLogin(admin) {
    const sid = nextSessionId++;
    const loginAt = nowStamp();
    setSessionLog(prev => [{
      id:        sid,
      adminUser: admin.username,
      role:      admin.role,
      loginAt,
      logoutAt:  null,
      duration:  null,
      active:    true,
    }, ...prev]);
    setActiveSessionId(sid);
    setCurrentAdmin(admin);
  }

  function handleLogout() {
    const logoutAt = nowStamp();
    setSessionLog(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      /* compute rough duration */
      const duration = calcDuration(s.loginAt, logoutAt);
      return { ...s, logoutAt, duration, active: false };
    }));
    setActiveSessionId(null);
    setCurrentAdmin(null);
  }

  /* rough human-readable duration between two nowStamp() strings */
  function calcDuration(fromStr, toStr) {
    try {
      const parse = s => {
        const [timePart, , dayPart, monPart] = s.split(' ');
        const [h, m] = timePart.split(':').map(Number);
        const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
        return new Date(2026, months[monPart], parseInt(dayPart), h, m);
      };
      const diff = Math.round((parse(toStr) - parse(fromStr)) / 60000); // minutes
      if (diff < 60) return `${diff}m`;
      const h = Math.floor(diff / 60), m = diff % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    } catch { return '—'; }
  }

  function handleSubmit(text) {
    const color = CARD_COLORS[nextId % CARD_COLORS.length];
    setMessages(prev => [...prev, { id: nextId++, text, time: 'just now', color, approved: false, votes: 0 }]);
  }

  function handleApprove(id, admin) {
    const msg = messages.find(m => m.id === id);
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, approved: true, time: 'just now', approvedBy: admin.username, approvedAt: nowStamp() } : m
    ));
    addLog(admin, 'approved', msg.text);
  }

  function handleReject(id, admin) {
    const msg = messages.find(m => m.id === id);
    setMessages(prev => prev.filter(m => m.id !== id));
    addLog(admin, 'rejected', msg.text);
  }

  function handleDelete(id, admin) {
    const msg = messages.find(m => m.id === id);
    setMessages(prev => prev.filter(m => m.id !== id));
    addLog(admin, 'removed', msg.text);
  }

  function handleAddAdmin(newAccount) {
    setAdminAccounts(prev => [...prev, newAccount]);
    addLog(currentAdmin, 'admin_added', `New admin account: ${newAccount.username} (${newAccount.role})`);
  }

  function handleRemoveAdmin(username, admin) {
    setAdminAccounts(prev => prev.filter(a => a.username !== username));
    addLog(admin, 'admin_removed', `Admin account removed: ${username}`);
  }

  return (
    <div>
      <Navbar activePage={activePage} onChangePage={setActivePage} currentAdmin={currentAdmin} />

      {activePage === 'public' ? (
        <PublicPage messages={messages} onSubmit={handleSubmit} />
      ) : (
        <AdminPage
          messages={messages}
          auditLog={auditLog}
          sessionLog={sessionLog}
          adminAccounts={adminAccounts}
          currentAdmin={currentAdmin}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onAddAdmin={handleAddAdmin}
          onRemoveAdmin={handleRemoveAdmin}
        />
      )}

      <footer className="footer">
        <p className="footer__text">
          <span>My Student House</span> · Student Voice Board ·
          All messages are anonymous and moderated before publishing.
        </p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
