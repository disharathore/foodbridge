import { useApp } from '../context/AppContext';

// Fix #3: Decode JWT to check expiry client-side
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // treat malformed token as expired
  }
}

export function useAuth() {
  const { state, dispatch } = useApp();

  const getToken = () => {
    const token = localStorage.getItem('fb_token');
    if (!token) return null;
    // Auto-clear expired tokens so user gets clean logout
    if (isTokenExpired(token)) {
      localStorage.removeItem('fb_token');
      dispatch({ type: 'SET_USER', payload: null });
      return null;
    }
    return token;
  };

  const setUser = (user, token) => {
    localStorage.setItem('fb_token', token);
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('fb_token');
    dispatch({ type: 'SET_USER', payload: null });
  };

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  return { user: state.user, getToken, setUser, logout, authHeaders, isLoggedIn: !!state.user };
}
