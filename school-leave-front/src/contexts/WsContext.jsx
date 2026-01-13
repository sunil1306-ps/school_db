import { createContext, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const WsContext = createContext();

export const useWs = () => useContext(WsContext);

export const WsProvider = ({ children }) => {
  const { user } = useAuth();
  const ws = useRef(null);

  useEffect(() => {
    if (!user) {
      if (ws.current) ws.current.close();
      return;
    }

    const url = `ws://127.0.0.1:8000/ws/leave/?token=${user.token}`;
    ws.current = new WebSocket(url);

    ws.current.onopen = () => console.log('[WS] open');
    ws.current.onclose = () => console.log('[WS] closed');
    ws.current.onerror = (e) => console.error('[WS] error', e);

    ws.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      window.dispatchEvent(new CustomEvent('leave.changed', { detail: data }));
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [user]);

  return <WsContext.Provider value={{ ws: ws.current }}>{children}</WsContext.Provider>;
};