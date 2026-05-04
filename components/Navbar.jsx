/* ── Navbar ──────────────────────────────────────────────── */
function Navbar({ activePage, onChangePage }) {
  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* Brand */}
        <a className="navbar__brand" href="#">
          <div className="navbar__logo-mark">
            <svg viewBox="0 0 24 24" fill="#0d1b3e" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__brand-title">My Student House</span>
            <span className="navbar__brand-sub">Student Voice</span>
          </div>
        </a>

        {/* Tab switcher */}
        <div className="navbar__tabs">
          <button
            className={`navbar__tab ${activePage === 'public' ? 'navbar__tab--active' : ''}`}
            onClick={() => onChangePage('public')}
          >
            Board
          </button>
          <button
            className={`navbar__tab ${activePage === 'admin' ? 'navbar__tab--active' : ''}`}
            onClick={() => onChangePage('admin')}
          >
            Admin
          </button>
        </div>

      </div>
    </nav>
  );
}
