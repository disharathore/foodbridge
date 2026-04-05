export default function NotFound({ onNavigate }) {
  return (
    <div className="page-404">
      <div style={{ fontSize: 80, marginBottom: 20 }}>🍱</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Page not found</h1>
      <p style={{ color: '#6b7280', marginBottom: 28 }}>This page doesn't exist. Let's get you back.</p>
      <button className="btn-primary" onClick={() => onNavigate('dashboard')}>← Back to home</button>
    </div>
  );
}
