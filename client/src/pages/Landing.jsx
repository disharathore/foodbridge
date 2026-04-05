import React from 'react';

const STATS = [
  { val: '4,218+', label: 'Meals rescued today', icon: '🍽️' },
  { val: '1,063 kg', label: 'CO₂ offset', icon: '🌿' },
  { val: '18 min', label: 'Avg pickup time', icon: '⚡' },
  { val: '24+', label: 'Partner NGOs', icon: '🤝' },
];

const FOOD_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format', label: 'Dal & Rice', loc: 'Connaught Place', meals: 80, status: 'Available', statusColor: '#16a34a', statusBg: '#dcfce7' },
  { src: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop&auto=format', label: 'Biryani', loc: 'Noida Sector 18', meals: 45, status: 'Claimed', statusColor: '#d97706', statusBg: '#fef9c3' },
  { src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&auto=format', label: 'Fresh Bread', loc: 'Dwarka Sector 6', meals: 120, status: 'In Transit', statusColor: '#2563eb', statusBg: '#dbeafe' },
  { src: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format', label: 'Samosas', loc: 'Rohini', meals: 60, status: 'Available', statusColor: '#16a34a', statusBg: '#dcfce7' },
  { src: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=400&fit=crop&auto=format', label: 'Paneer Curry', loc: 'Gurugram', meals: 35, status: 'Available', statusColor: '#16a34a', statusBg: '#dcfce7' },
  { src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop&auto=format', label: 'Sweets & Mithai', loc: 'Lajpat Nagar', meals: 90, status: 'Available', statusColor: '#16a34a', statusBg: '#dcfce7' },
];

const HOW = [
  { step: 1, icon: '🍱', title: 'Restaurant posts surplus', desc: 'Add food details and pickup window in under 60 seconds. Goes live instantly across the city.' },
  { step: 2, icon: '🔔', title: 'NGO gets notified live', desc: 'Nearby NGOs receive real-time WebSocket alerts. First to claim, first to serve.' },
  { step: 3, icon: '🚗', title: 'Volunteer delivers', desc: 'Track every pickup live. Impact — meals saved, CO₂ offset — recorded automatically.' },
];

const TESTIMONIALS = [
  { name: 'Annapurna NGO', role: 'Partner NGO · Delhi', text: 'FoodBridge changed how we source food. We used to call 10 restaurants daily. Now alerts come to us in real time.', avatar: '🏛️' },
  { name: 'Biryani House', role: 'Donor Restaurant · CP', text: 'We wasted 40–50 portions every night. Now it reaches families in under 30 minutes. Feels incredible.', avatar: '🍛' },
  { name: 'Rahul Kumar', role: 'Volunteer · Noida', text: 'I deliver twice a week after work. The app tells me exactly where to go. Takes 45 minutes and feeds 60 people.', avatar: '🚗' },
];

export default function Landing({ onNavigate }) {
  return (
    <div style={{ fontFamily: 'var(--font)' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a06 50%, #0f0f0f 100%)',
        minHeight: '92vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background food images grid */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 2, opacity: 0.18, pointerEvents: 'none' }}>
          {FOOD_PHOTOS.map((p, i) => (
            <img key={i} src={p.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ))}
        </div>
        {/* Dark gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(15,15,15,0.5) 0%, rgba(15,15,15,0.85) 70%)', pointerEvents: 'none' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,51,10,0.15)', border: '1px solid rgba(232,51,10,0.35)', color: '#ff7a55', padding: '7px 18px', borderRadius: 24, fontSize: 12, fontWeight: 600, marginBottom: 28, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            🌍 Real-time Food Rescue · Feeding India × Zomato
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em' }}>
            Every meal saved is<br />
            <span style={{ color: '#e8330a' }}>a life touched.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            FoodBridge connects restaurants with surplus food to NGOs and volunteers across India — in real time. Zero waste. Maximum impact.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <button onClick={() => onNavigate('donor')} style={{ padding: '16px 36px', background: '#e8330a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', boxShadow: '0 4px 24px rgba(232,51,10,0.4)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.target.style.transform='translateY(-2px)'} onMouseLeave={e => e.target.style.transform='translateY(0)'}>
              🍱 Donate Surplus Food
            </button>
            <button onClick={() => onNavigate('receiver')} style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.18)'} onMouseLeave={e => e.target.style.background='rgba(255,255,255,0.1)'}>
              🤝 Claim as NGO
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 0', backdropFilter: 'blur(12px)', flexWrap: 'wrap' }}>
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <div style={{ padding: '0 32px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
                </div>
                {i < STATS.length - 1 && <div style={{ width: 1, background: 'rgba(255,255,255,0.12)', alignSelf: 'stretch' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── LIVE LISTINGS MOSAIC ─────────────────────────────── */}
      <div style={{ background: '#fff', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#e8330a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Live right now</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#111', marginBottom: 14 }}>Food being rescued in Delhi NCR</h2>
            <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>Every card below is a real surplus food listing. NGOs claim these in real time.</p>
          </div>

          {/* Masonry-style grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FOOD_PHOTOS.map((p, i) => (
              <div key={i} style={{
                borderRadius: 16, overflow: 'hidden', position: 'relative',
                height: i === 0 || i === 4 ? 320 : 240,
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                cursor: 'pointer', transition: 'transform 0.2s',
                gridRow: i === 0 ? 'span 1' : 'auto',
              }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                onClick={() => onNavigate('receiver')}
              >
                <img src={p.src} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, background: p.statusBg, color: p.statusColor, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                  {p.status}
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 3 }}>{p.label}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>📍 {p.loc} · {p.meals} meals</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button onClick={() => onNavigate('dashboard')} style={{ padding: '13px 32px', background: '#111', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
              View all live listings →
            </button>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div style={{ background: '#f9fafb', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#e8330a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>How it works</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#111' }}>From kitchen to community in minutes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {HOW.map((h, i) => (
              <div key={h.step} style={{ background: '#fff', borderRadius: 20, padding: '36px 28px', border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 80, opacity: 0.06, lineHeight: 1 }}>{h.icon}</div>
                <div style={{ width: 36, height: 36, background: '#e8330a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 20 }}>{h.step}</div>
                <div style={{ fontSize: 52, marginBottom: 16 }}>{h.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 10 }}>{h.title}</div>
                <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{h.desc}</div>
                {i < HOW.length - 1 && (
                  <div style={{ position: 'absolute', top: '50%', right: -18, transform: 'translateY(-50%)', fontSize: 24, color: '#d1d5db', zIndex: 10 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FULL-WIDTH IMPACT BANNER ──────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 400, display: 'flex', alignItems: 'center' }}>
        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&h=500&fit=crop&auto=format" alt="impact" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(232,51,10,0.92) 0%, rgba(180,30,0,0.88) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '60px 40px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ maxWidth: 500 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Our mission</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>No food should go to waste while people go hungry.</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>India wastes 40% of its food production annually — enough to feed every hungry person in the country. FoodBridge is built to fix that.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { n: '40%', l: 'India\'s food wasted annually' },
              { n: '194M', l: 'Indians face food insecurity' },
              { n: '₹92,000 Cr', l: 'Food wasted per year' },
              { n: '0.25 kg', l: 'CO₂ saved per meal rescued' },
            ].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '20px 18px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <div style={{ background: '#fff', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#e8330a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Stories</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#111' }}>From our community</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: '#f9fafb', borderRadius: 20, padding: '32px 28px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>❝</div>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#e8330a,#ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <div style={{ background: '#111', padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(232,51,10,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🍛</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>Ready to rescue food?</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 40, lineHeight: 1.7 }}>Join thousands of restaurants, NGOs, and volunteers already using FoodBridge to make a difference.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('donor')} style={{ padding: '16px 36px', background: '#e8330a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', boxShadow: '0 4px 24px rgba(232,51,10,0.4)' }}>
              🍱 Start donating food
            </button>
            <button onClick={() => onNavigate('login')} style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
              🔑 Create free account
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .landing-mosaic { grid-template-columns: repeat(2,1fr) !important; }
          .landing-how { grid-template-columns: 1fr !important; }
          .landing-testi { grid-template-columns: 1fr !important; }
          .landing-impact { flex-direction: column !important; }
        }
        @media (max-width: 600px) {
          .landing-mosaic { grid-template-columns: 1fr !important; }
          .landing-stats { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
