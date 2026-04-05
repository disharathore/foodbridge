export default function About({ onNavigate }) {
  const TEAM = [
    { name: 'Mission', icon: '🎯', desc: 'Connect every surplus meal to someone who needs it — in under 20 minutes, anywhere in India.' },
    { name: 'Technology', icon: '⚡', desc: 'Real-time WebSocket updates, geospatial matching, and role-based access built for scale.' },
    { name: 'Impact', icon: '🌍', desc: 'Every meal we rescue offsets 0.25 kg CO₂ and prevents perfectly good food from reaching landfill.' },
  ];

  const TECH = [
    { name: 'React 18', desc: 'Context API + custom hooks', color: '#61dafb' },
    { name: 'Node.js', desc: 'Express REST API', color: '#8cc84b' },
    { name: 'Socket.io', desc: 'Real-time WebSockets', color: '#e8330a' },
    { name: 'MongoDB', desc: 'Geospatial indexing', color: '#47a248' },
    { name: 'JWT Auth', desc: 'Role-based access control', color: '#f59e0b' },
    { name: 'Helmet + Rate Limit', desc: 'Production security', color: '#7c3aed' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🍛</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', marginBottom: 14 }}>About FoodBridge</h1>
        <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          A real-time food surplus rescue platform built for <strong>Feeding India by Zomato</strong>. 
          Engineered to eliminate food waste and hunger simultaneously.
        </p>
      </div>

      {/* Mission cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 56 }}>
        {TEAM.map(t => (
          <div key={t.name} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{t.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 10 }}>{t.name}</div>
            <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div style={{ background: '#f9fafb', borderRadius: 20, padding: '36px', marginBottom: 40, border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 24, textAlign: 'center' }}>🛠️ Tech stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {TECH.map(t => (
            <div key={t.name} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key features list */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px', border: '1px solid #e5e7eb', marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 24 }}>⚡ Key engineering features</h2>
        {[
          ['Real-time updates', 'Socket.io rooms per city — listings update live across all connected clients without polling'],
          ['Atomic claims', 'MongoDB findOneAndUpdate prevents two NGOs from claiming the same listing simultaneously'],
          ['Geospatial search', '2dsphere index enables finding nearest surplus within a configurable radius in milliseconds'],
          ['Role-based access', 'JWT middleware enforces donor/NGO/volunteer/admin permissions on every protected route'],
          ['Race condition prevention', 'All write operations use atomic MongoDB operators — no double-spend bugs'],
          ['Production security', 'Helmet.js security headers, express-rate-limit, input validation with express-validator'],
          ['Pagination', 'All list endpoints paginated — handles thousands of listings without performance degradation'],
          ['Error boundaries', 'React ErrorBoundary catches runtime crashes — users see a clean fallback instead of white screen'],
        ].map(([title, desc]) => (
          <div key={title} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8330a', flexShrink: 0, marginTop: 7 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={() => onNavigate('home')} className="btn-primary">← Back to home</button>
      </div>
    </div>
  );
}
