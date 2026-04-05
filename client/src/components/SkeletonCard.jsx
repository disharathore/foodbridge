export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ width: 72, height: 72, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 16, width: '60%' }} />
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
        <div className="skeleton" style={{ height: 12, width: '50%' }} />
      </div>
    </div>
  );
}
