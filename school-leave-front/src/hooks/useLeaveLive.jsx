import { useEffect } from 'react';

export default function useLeaveLive(callback) {
  useEffect(() => {
    const handler = (e) => callback(e.detail);
    window.addEventListener('leave.changed', handler);
    return () => window.removeEventListener('leave.changed', handler);
  }, [callback]);
}