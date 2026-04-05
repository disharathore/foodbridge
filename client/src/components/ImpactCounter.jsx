import { useEffect, useRef, useState } from 'react';

// Animated number counter — runs once when element enters viewport
function AnimatedNumber({ target, duration = 1800, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

export default function ImpactCounter({ stats }) {
  const items = [
    { label: 'Meals rescued',    value: stats?.totalMealsSaved || 0,  suffix: '+', color: '#e8330a', icon: '🍽️' },
    { label: 'CO₂ saved (kg)',   value: stats?.co2Offset || 0,        suffix: '',  color: '#16a34a', icon: '🌿' },
    { label: 'Active listings',  value: stats?.activeListings || 0,   suffix: '',  color: '#2563eb', icon: '📦' },
    { label: 'Trees equivalent', value: Math.round((stats?.co2Offset||0)/21), suffix: '', color: '#d97706', icon: '🌳' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16 }}>
      {items.map(item => (
        <div key={item.label} style={{ background: '#fff', borderRadius: 14, padding: '24px 20px', border: '1px solid #e5e7eb', textAlign: 'center', borderTop: `3px solid ${item.color}` }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: item.color }}>
            <AnimatedNumber target={item.value} suffix={item.suffix} />
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, fontWeight: 500 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
