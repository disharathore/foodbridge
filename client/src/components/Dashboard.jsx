import { useEffect, useState, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ListingCard from './ListingCard';
import SkeletonCard from './SkeletonCard';

const ACTIVITIES = [
  { dot: '#22c55e', text: 'Biryani House posted 80 meals in Connaught Place', time: '2 min ago' },
  { dot: '#3b82f6', text: 'NGO Annapurna claimed 45 meals from Green Leaf', time: '8 min ago' },
  { dot: '#f59e0b', text: 'Volunteer Rahul picked up 120 meals — en route', time: '15 min ago' },
  { dot: '#a855f7', text: '60 meals delivered to Gurugram night shelter', time: '32 min ago' },
  { dot: '#22c55e', text: 'Sewa Foundation registered as partner NGO', time: '41 min ago' },
];

export default function Dashboard({ onNavigate }) {
  const { state, dispatch } = useApp();
  const [stats, setStats] = useState({ totalMealsSaved: 0, mealsTodaySaved: 0, activeListings: 0, co2Offset: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  // Fix #4: base is stable (process.env never changes), use ref to avoid stale closure
  const base = process.env.REACT_APP_SERVER_URL;
  const cityRef = useRef(state.city);
  useEffect(() => { cityRef.current = state.city; }, [state.city]);

  // Fix #4: fetchListings with correct useCallback deps
  const fetchListings = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/listings?city=${cityRef.current}&page=${p}&limit=10`);
      const data = await res.json();
      dispatch({ type: 'SET_LISTINGS', payload: Array.isArray(data.listings) ? data.listings : [] });
      setTotalPages(data.pages || 1);
    } catch {
      dispatch({ type: 'SET_LISTINGS', payload: [] });
    } finally {
      setLoading(false);
    }
  }, [base, dispatch]);

  useEffect(() => {
    fetchListings(1);
    setPage(1);
  }, [state.city, fetchListings]);

  useEffect(() => {
    fetch(`${base}/api/listings/stats/summary`)
      .then(r => r.json())
      .then(d => { if (d && !d.error) setStats(d); })
      .catch(() => {});
  }, [base]);

  const listings = Array.isArray(state.listings) ? state.listings : [];
  const filtered = filter === 'all' ? listings : listings.filter(l => l.foodType === filter);

  const METRICS = [
    { icon: '🍽️', label: 'Meals saved today',  value: stats.mealsTodaySaved?.toLocaleString() || '0', delta: 'Updated live' },
    { icon: '📦', label: 'Active listings',     value: stats.activeListings || 0,                     delta: 'Right now' },
    { icon: '⚡', label: 'Avg pickup time',     value: '18 min',                                       delta: '4 min faster than yesterday' },
    { icon: '🌿', label: 'CO₂ offset (kg)',     value: stats.co2Offset?.toLocaleString() || '0',      delta: 'Total to date' },
  ];

  const FILTERS = [
    { v: 'all', l: 'All' }, { v: 'main_course', l: '🍛 Main' },
    { v: 'bread', l: '🍞 Bread' }, { v: 'dessert', l: '🎂 Dessert' },
    { v: 'salad', l: '🥗 Salad' }, { v: 'beverage', l: '🥤 Drinks' },
  ];

  return (
    <div className="page-wrap">
      <div className="metrics-grid">
        {METRICS.map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon">{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-delta">↑ {m.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 36 }}>
        <div className="section-header">
          <div><div className="section-title">How FoodBridge works</div><div className="section-sub">Three steps · real time · zero waste</div></div>
        </div>
        <div className="how-grid">
          {[
            { s:1, icon:'🍱', title:'Restaurant posts surplus', desc:'Add food details in 60 seconds. Goes live instantly.' },
            { s:2, icon:'🔔', title:'NGO claims in real time',  desc:'Nearby NGOs receive WebSocket alerts. First to claim gets it.' },
            { s:3, icon:'🚗', title:'Volunteer delivers',        desc:'Full journey tracked. Impact recorded automatically.' },
          ].map(h => (
            <div className="how-card" key={h.s}>
              <div className="how-step">{h.s}</div>
              <div className="how-icon">{h.icon}</div>
              <div className="how-title">{h.title}</div>
              <div className="how-desc">{h.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div>
          <div className="section-header">
            <div>
              <div className="section-title">Live surplus listings</div>
              <div className="section-sub">{state.city} · {listings.length} active</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: 20, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="live-dot" />WebSocket live
              </span>
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => onNavigate('donor')}>
                + Post food
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {FILTERS.map(f => (
              <button key={f.v} onClick={() => setFilter(f.v)} style={{
                padding: '6px 14px', borderRadius: 20,
                border: `1px solid ${filter === f.v ? '#e8330a' : '#e5e7eb'}`,
                background: filter === f.v ? '#fff1ee' : '#fff',
                color: filter === f.v ? '#e8330a' : '#374151',
                fontSize: 12, fontWeight: filter === f.v ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font)',
              }}>{f.l}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">🍱</div>
                <div className="empty-title">No listings right now</div>
                <div className="empty-desc">Be the first to donate today!</div>
                <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => onNavigate('donor')}>
                  Post surplus food →
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(l => <ListingCard key={l._id} listing={l} />)}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                  <button onClick={() => { const p = page - 1; setPage(p); fetchListings(p); }} disabled={page === 1}
                    style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontFamily: 'var(--font)' }}>
                    ← Prev
                  </button>
                  <span style={{ padding: '8px 16px', fontSize: 13, color: '#6b7280' }}>Page {page} of {totalPages}</span>
                  <button onClick={() => { const p = page + 1; setPage(p); fetchListings(p); }} disabled={page === totalPages}
                    style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, fontFamily: 'var(--font)' }}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🔴 Live activity</div>
            <div className="timeline">
              {ACTIVITIES.map((a, i) => (
                <div className="tl-item" key={i}>
                  <div className="tl-dot" style={{ background: a.dot }} />
                  <div>
                    <div className="tl-text">{a.text}</div>
                    <div className="tl-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg,#fff7f5,#fff)', border: '1px solid #fdd' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🍱</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Have surplus food?</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, lineHeight: 1.6 }}>Post in 60 seconds. NGOs notified instantly.</div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => onNavigate('donor')}>Donate food now →</button>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg,#f0fdf4,#fff)', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🤝</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>NGO or volunteer?</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, lineHeight: 1.6 }}>Register to get live alerts for surplus food near you.</div>
            <button className="btn-secondary" style={{ width: '100%', padding: '12px', fontFamily: 'var(--font)' }} onClick={() => onNavigate('receiver')}>Claim food →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
