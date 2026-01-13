import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WsProvider } from './contexts/WsContext';
import Login from './components/Login';
import LeaveList from './components/LeaveList';
import LeaveForm from './components/LeaveForm';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import StudentDashboard from './components/StudentDashboard';

// NEW: small component that CAN read user
function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'teacher')   return <TeacherDashboard />;
  if (user.role === 'parent')    return <ParentDashboard />;
  return <StudentDashboard />;
}

// helper for non-teacher roles (keeps your old UI)
function NormalDashboard() {
  const { logout } = useAuth();
  return (
    <WsProvider>
      <button onClick={logout}>Logout</button>
      <h1>Leave dashboard</h1>
      <LeaveForm />
      <LeaveList />
    </WsProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}