/* ── MessageCard — NGL layout, MyStudentHouse colours ───── */
function MessageCard({ msg, index, onVote }) {
  const delay = `${index * 0.07}s`;

  return (
    <div className="ngl-card anim-fade-up" style={{ animationDelay: delay }}>

      {/* Navy gradient header banner */}
      <div className="ngl-card__header">
        <span className="ngl-card__header-text">anonymous message</span>
      </div>

      {/* White body: centred bold navy text */}
      <div className="ngl-card__body">
        <p className="ngl-card__text">{msg.text}</p>
      </div>

      {/* Footer: colour wheel + vote + time */}
      <div className="ngl-card__footer">
        <div className="ngl-card__icons">
          {/* Colour wheel using navy + gold shades */}
          <svg width="28" height="28" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="49" fill="#f2f2f2"/>
            <path d="M50,50 L50,4 A46,46 0 0,1 89.8,27 Z" fill="#0d1b3e"/>
            <path d="M50,50 L50,4 A46,46 0 0,1 89.8,27 Z" fill="#162247" transform="rotate(60,50,50)"/>
            <path d="M50,50 L50,4 A46,46 0 0,1 89.8,27 Z" fill="#1e2f5c" transform="rotate(120,50,50)"/>
            <path d="M50,50 L50,4 A46,46 0 0,1 89.8,27 Z" fill="#253570" transform="rotate(180,50,50)"/>
            <path d="M50,50 L50,4 A46,46 0 0,1 89.8,27 Z" fill="#f5c518" transform="rotate(240,50,50)"/>
            <path d="M50,50 L50,4 A46,46 0 0,1 89.8,27 Z" fill="#c9a010" transform="rotate(300,50,50)"/>
            <circle cx="50" cy="50" r="17" fill="white"/>
          </svg>
          {/* Camera icon */}
          <div className="ngl-card__cam-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#bbb">
              <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zm7-12H8.83L7 1H5C3.9 1 3 1.9 3 3v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
            </svg>
          </div>
        </div>

        {/* Vote + time */}
        <div className="ngl-card__right">
          <button
            className={`ngl-card__vote${msg.voted ? ' ngl-card__vote--active' : ''}`}
            onClick={() => onVote(msg.id)}
            title={msg.voted ? 'Remove vote' : 'Upvote'}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83V19c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3-7.12z"/>
            </svg>
            {msg.votes}
          </button>
          <span className="ngl-card__time">{msg.time}</span>
        </div>
      </div>

    </div>
  );
}