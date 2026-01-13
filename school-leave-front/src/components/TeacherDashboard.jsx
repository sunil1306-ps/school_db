import LeaveList from './LeaveList';
import AddUserForm from './AddUserForm';
import './TeacherDashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { WsProvider } from '../contexts/WsContext';

export default function TeacherDashboard() {
    const { logout } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: '#111827', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#e5e7eb', fontSize: '2rem', fontWeight: 600 }}>Teacher Dashboard</h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem' }}>Manage leaves and users in one place</p>
      </header>

      <main style={{ width: '100%', maxWidth: 1200, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left card : Leave requests */}
        <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,.5)' }}>
          <h2 style={{ color: '#e5e7eb', margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Leave Requests</h2>
          <WsProvider>           {/* ← wrapped only around the list */}
            <LeaveList />
          </WsProvider>
        </div>

        {/* Right card : Add user */}
        <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,.5)', height: 'fit-content' }}>
          <h2 style={{ color: '#e5e7eb', margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Add New User</h2>
          <AddUserForm />
        </div>
      </main>

      <button onClick={logout} style={{ marginTop: '1rem', padding: '.4rem 1rem', borderRadius: 6, border: '1px solid #374151', background: '#1f2937', color: '#e5e7eb', cursor: 'pointer' }}>Logout</button>
    </div>
  );
}