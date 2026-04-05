import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function Login({ onSuccess }) {
  const { setUser } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor', organization: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  // Frontend validation — fix #21
  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/api/auth/${mode === 'login' ? 'login' : 'register'}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Something went wrong'); return; }
      setUser(data.user, data.token);
      toast.success(mode === 'login' ? `Welcome back, ${data.user.name}! 👋` : `Welcome to FoodBridge, ${data.user.name}! 🎉`);
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Cannot connect to server. Make sure the backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const ROLES = [
    { v: 'donor',     emoji: '🍱', label: 'Donor',     desc: 'Restaurant / hotel' },
    { v: 'ngo',       emoji: '🤝', label: 'NGO',       desc: 'Charity / shelter' },
    { v: 'volunteer', emoji: '🚗', label: 'Volunteer', desc: 'Pickup & delivery' },
  ];

  return (
    <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#e8330a,#ff6b35)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, marginBottom: 16, boxShadow: '0 4px 14px rgba(232,51,10,0.3)' }}>🍛</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>
            {mode === 'login' ? 'Welcome back' : 'Join FoodBridge'}
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>
            {mode === 'login' ? 'Sign in to rescue food' : 'Start saving food in your city'}
          </p>
        </div>

        <div className="tab-bar" style={{ marginBottom: 28 }}>
          <button className={`tab-btn ${mode==='login'?'active':''}`} onClick={() => { setMode('login'); setErrors({}); }}>Sign in</button>
          <button className={`tab-btn ${mode==='register'?'active':''}`} onClick={() => { setMode('register'); setErrors({}); }}>Create account</button>
        </div>

        <div className="card card-lg">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input className={`form-input ${errors.name?'error':''}`} placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <div style={{ color:'#dc2626', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">I am a...</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {ROLES.map(r => (
                    <div key={r.v} onClick={() => set('role', r.v)} style={{
                      padding: '12px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                      border: `2px solid ${form.role === r.v ? '#e8330a' : '#e5e7eb'}`,
                      background: form.role === r.v ? '#fff1ee' : '#fff', transition: 'all 0.15s',
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{r.emoji}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: form.role === r.v ? '#e8330a' : '#374151' }}>{r.label}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Organization <span style={{ color:'#9ca3af', fontWeight:400 }}>(optional)</span></label>
                <input className="form-input" placeholder="e.g. Biryani House / Sewa Trust" value={form.organization} onChange={e => set('organization', e.target.value)} />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className={`form-input ${errors.email?'error':''}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            {errors.email && <div style={{ color:'#dc2626', fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password <span style={{ color:'#9ca3af', fontWeight:400 }}>(min 6 chars)</span></label>
            <input className={`form-input ${errors.password?'error':''}`} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key==='Enter' && handleSubmit()} />
            {errors.password && <div style={{ color:'#dc2626', fontSize: 12, marginTop: 4 }}>{errors.password}</div>}
          </div>

          <button className="form-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? 'Sign in →' : 'Create account →'}
          </button>
        </div>

        <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#6b7280' }}>
          {mode === 'login' ? "No account? " : 'Have an account? '}
          <button style={{ color:'#e8330a', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontSize:13, fontFamily:'var(--font)' }}
            onClick={() => { setMode(mode==='login'?'register':'login'); setErrors({}); }}>
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
