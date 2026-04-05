import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import LiveTicker from './components/LiveTicker';
import Landing from './pages/Landing';
import Donor from './pages/Donor';
import Impact from './pages/Impact';
import Login from './pages/Login';
import Receiver from './pages/Receiver';
import Volunteer from './pages/Volunteer';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './index.css';

const NAV = [
  { id: 'dashboard', label: 'Live Feed',   icon: '🟢' },
  { id: 'donor',     label: 'Donate Food', icon: '🍱' },
  { id: 'receiver',  label: 'Claim Food',  icon: '🤝' },
  { id: 'volunteer', label: 'Volunteer',   icon: '🚗' },
  { id: 'impact',    label: 'Impact',      icon: '📊' },
];

const VALID_PAGES = ['home','dashboard','donor','receiver','volunteer','impact','login','about'];

function AppInner() {
  const { state, dispatch } = useApp();
  const { user, logout } = useAuth();
  const [page, setPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('fb_token');
    if (!token) return;
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) dispatch({ type: 'SET_USER', payload: u }); })
      .catch(() => {});
  }, [dispatch]);

  const navigate = (p) => {
    setPage(p);
    setMenuOpen(false);
    setShowNotif(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => { logout(); navigate('home'); };
  const notifications = state.notifications || [];

  return (
    <div className="app-root">
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: 'var(--font)', fontSize: 13 } }} />

      {/* Live activity ticker */}
      <LiveTicker />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('home')}>
          <div className="nav-logo">🍛</div>
          <div>
            <div className="nav-title">FoodBridge</div>
            <div className="nav-sub">Feeding India · Zomato</div>
          </div>
        </div>

        <div className="nav-links">
          {NAV.map(n => (
            <button key={n.id} className={`nav-link ${page === n.id ? 'active' : ''}`} onClick={() => navigate(n.id)}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
          <button className={`nav-link ${page === 'about' ? 'active' : ''}`} onClick={() => navigate('about')}>
            <span className="nav-icon">ℹ️</span>About
          </button>
        </div>

        <div className="nav-right">
          <div className="live-pill"><span className="live-dot" />Live · {state.city}</div>

          {/* Notification bell */}
          <div style={{ position: 'relative' }}>
            <button className="notif-btn" onClick={() => setShowNotif(!showNotif)}>
              🔔
              {notifications.length > 0 && (
                <span className="notif-badge">{notifications.length > 9 ? '9+' : notifications.length}</span>
              )}
            </button>
            {showNotif && (
              <div className="notif-panel">
                <div className="notif-header">
                  Notifications
                  <button onClick={() => { dispatch({ type: 'SET_NOTIFICATIONS', payload: [] }); setShowNotif(false); }}
                    style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    Clear all
                  </button>
                </div>
                {notifications.length === 0
                  ? <div className="notif-empty">🔔 No new notifications</div>
                  : notifications.map((n, i) => (
                    <div className="notif-item" key={i}>
                      <div className="notif-dot" />
                      <div>
                        <div>{n.text}</div>
                        <div className="notif-time">{n.time ? new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {user ? (
            <div className="user-menu">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.role}</div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>Sign out</button>
            </div>
          ) : (
            <button className="signin-btn" onClick={() => navigate('login')}>Sign in</button>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-link" onClick={() => navigate('home')}>🏠 Home</button>
          {NAV.map(n => (
            <button key={n.id} className={`mobile-link ${page === n.id ? 'active' : ''}`} onClick={() => navigate(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
          <button className="mobile-link" onClick={() => navigate('about')}>ℹ️ About</button>
          <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 8, paddingTop: 8 }}>
            {user
              ? <button className="mobile-link" onClick={handleLogout}>🚪 Sign out ({user.name})</button>
              : <button className="mobile-link" onClick={() => navigate('login')}>🔑 Sign in</button>
            }
          </div>
        </div>
      )}

      {/* ── PAGES ── */}
      <main className="main-content">
        <ErrorBoundary>
          {page === 'home'      && <Landing onNavigate={navigate} />}
          {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {page === 'donor'     && (user ? <Donor /> : <Login onSuccess={() => navigate('donor')} />)}
          {page === 'receiver'  && (user ? <Receiver /> : <Login onSuccess={() => navigate('receiver')} />)}
          {page === 'volunteer' && (user ? <Volunteer /> : <Login onSuccess={() => navigate('volunteer')} />)}
          {page === 'impact'    && <Impact />}
          {page === 'login'     && <Login onSuccess={() => navigate('home')} />}
          {page === 'about'     && <About onNavigate={navigate} />}
          {!VALID_PAGES.includes(page) && <NotFound onNavigate={navigate} />}
        </ErrorBoundary>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>🍛 FoodBridge — Feeding India · Zomato</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <button onClick={() => navigate('about')} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>About</button>
            <button onClick={() => navigate('impact')} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>Impact</button>
          </div>
          <span>© 2025</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
