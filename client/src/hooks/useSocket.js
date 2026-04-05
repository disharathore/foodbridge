import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001';

export function useSocket(city, handlers = {}) {
  const socketRef = useRef(null);
  // Store handlers in a ref so the effect doesn't re-run when they change
  // but always calls the latest version — fixes the stale closure / listener stacking bug
  const handlersRef = useRef(handlers);
  useEffect(() => { handlersRef.current = handlers; });

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit('join:city', city);

    // Single stable listener per event that delegates to the latest handler
    const events = Object.keys(handlersRef.current);
    const delegators = {};
    events.forEach(event => {
      delegators[event] = (data) => handlersRef.current[event]?.(data);
      socket.on(event, delegators[event]);
    });

    return () => {
      events.forEach(event => socket.off(event, delegators[event]));
      socket.disconnect();
    };
  // Only reconnect when city changes — not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { emit };
}
