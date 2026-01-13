// src/components/StudentDashboard.jsx
import LeaveList from './LeaveList';
import { WsProvider } from '../contexts/WsContext';
import { useAuth } from '../contexts/AuthContext';

export default function StudentDashboard() {
  const { logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#111827', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#e5e7eb', fontSize: '2rem', fontWeight: 600 }}>Student Dashboard</h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem' }}>Your leave requests</p>
        <button onClick={logout} style={{ marginTop: '1rem', padding: '.4rem 1rem', borderRadius: 6, border: '1px solid #374151', background: '#1f2937', color: '#e5e7eb', cursor: 'pointer' }}>Logout</button>
      </header>

      <main style={{ width: '100%', maxWidth: 800 }}>
        <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,.5)' }}>
          <h2 style={{ color: '#e5e7eb', margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>My Leaves</h2>
          <WsProvider>
            <LeaveList />
          </WsProvider>
        </div>
      </main>
    </div>
  );
}