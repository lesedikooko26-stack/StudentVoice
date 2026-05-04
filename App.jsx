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

const SEED_MESSAGES = [
  {
    id: 1,
    text: "The communal kitchen on floor 2 needs a proper cleaning schedule. It's been left messy most evenings this week.",
    time: '2h ago',
    color: '#f5c518',
    approved: true,
    votes: 14,
  },
  {
    id: 2,
    text: "WiFi keeps dropping after 9pm on weeknights. Please can someone check the router on the 3rd floor? It's affecting studying.",
    time: '5h ago',
    color: '#4a9eff',
    approved: true,
    votes: 31,
  },
  {
    id: 3,
    text: "Can we get a proper notice board in the common room for announcements? Would really help residents stay informed.",
    time: '1d ago',
    color: '#27c97e',
    approved: true,
    votes: 9,
  },
  {
    id: 4,
    text: "Hot water was ice cold again this morning — fourth time this month. Please escalate this urgently!",
    time: '1d ago',
    color: '#e8504a',
    approved: true,
    votes: 42,
  },
  {
    id: 5,
    text: "Would love a group study session organised in the common room before June exams. Anyone keen?",
    time: '2d ago',
    color: '#b06aff',
    approved: true,
    votes: 7,
  },
  /* Pending (admin inbox) */
  {
    id: 6,
    text: "The laundry machines on floor 3 have been broken for over two weeks. Can maintenance please come check?",
    time: 'pending',
    color: '#ff8c42',
    approved: false,
    votes: 0,
  },
  {
    id: 7,
    text: "Parking area gate was left open all of last weekend. Security should be notified.",
    time: 'pending',
    color: '#00d4b4',
    approved: false,
    votes: 0,
  },
  {
    id: 8,
    text: "Can we please have a movie night in the common room? I'll bring popcorn if someone organises it 🍿",
    time: 'pending',
    color: '#ff6b9d',
    approved: false,
    votes: 0,
  },
];

/* ── Root App ──────────────────────────────────────────────── */
function App() {
  const [activePage, setActivePage] = useState('public');
  const [messages, setMessages]     = useState(SEED_MESSAGES);

  /* Student submits a new anonymous message */
  function handleSubmit(text) {
    const color = CARD_COLORS[nextId % CARD_COLORS.length];
    const newMsg = {
      id: nextId++,
      text,
      time: 'just now',
      color,
      approved: false,
      votes: 0,
    };
    setMessages(prev => [...prev, newMsg]);
  }

  /* Admin approves a pending message → publish it */
  function handleApprove(id) {
    setMessages(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, approved: true, time: 'just now' }
          : m
      )
    );
  }

  /* Admin rejects a pending message → remove it entirely */
  function handleReject(id) {
    setMessages(prev => prev.filter(m => m.id !== id));
  }

  /* Admin removes an already-published message */
  function handleDelete(id) {
    setMessages(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div>
      {/* Sticky navigation */}
      <Navbar activePage={activePage} onChangePage={setActivePage} />

      {/* Page content */}
      {activePage === 'public' ? (
        <PublicPage
          messages={messages}
          onSubmit={handleSubmit}
        />
      ) : (
        <AdminPage
          messages={messages}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <p className="footer__text">
          <span>My Student House</span> · Student Voice Board ·
          All messages are anonymous and moderated before publishing.
        </p>
      </footer>
    </div>
  );
}

/* ── Mount ─────────────────────────────────────────────────── */
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
