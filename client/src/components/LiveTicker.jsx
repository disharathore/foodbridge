import { useState, useEffect } from 'react';

const MESSAGES = [
  '🍛 Biryani House just posted 80 meals in Connaught Place',
  '🤝 NGO Annapurna claimed 45 meals from Green Leaf Cafe',
  '🚗 Volunteer Rahul picked up 120 meals — en route to shelter',
  '🎉 60 meals delivered to Gurugram Night Shelter',
  '🍞 The Bakery Hub listed 90 bread portions — expires in 2h',
  '✅ Sewa Foundation received 35 meals — 70 people fed',
  '🌿 12 kg CO₂ offset in the last hour across Delhi NCR',
  '🍱 New listing: Sweet Corner — 60 desserts available now',
];

export default function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#111', color: '#fff', padding: '10px 0',
      overflow: 'hidden', borderBottom: '1px solid #222',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ background: '#e8330a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.08em', flexShrink: 0 }}>
          LIVE
        </span>
        <span style={{
          fontSize: 13, color: 'rgba(255,255,255,0.85)',
          transition: 'opacity 0.4s',
          opacity: visible ? 1 : 0,
        }}>
          {MESSAGES[idx]}
        </span>
      </div>
    </div>
  );
}
