// src/components/Login.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/token/', {
        email: email,
        password: password
      });
      const token = data.access;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const me = await axios.get('http://127.0.0.1:8000/accounts/api/user/me/');
      login({ ...me.data, token });
      nav('/');
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#111827',
      outline: 'none'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#1f2937',
        borderRadius: 12,
        padding: '2rem 2.5rem',
        boxShadow: '0 8px 30px rgba(0,0,0,.5)'
      }}>
        <h2 style={{ color: '#e5e7eb', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>Sign In</h2>
        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              padding: '.75rem 1rem',
              borderRadius: 6,
              border: '1px solid #374151',
              background: '#111827',
              color: '#e5e7eb',
              outline: 'none'
            }}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPass(e.target.value)}
            style={{
              padding: '.75rem 1rem',
              borderRadius: 6,
              border: '1px solid #374151',
              background: '#111827',
              color: '#e5e7eb',
              outline: 'none'
            }}
          />
          {error && <div style={{ color: '#f87171', fontSize: '.875rem' }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '.5rem',
              padding: '.75rem',
              borderRadius: 6,
              border: 'none',
              background: loading ? '#374151' : '#2563eb',
              color: '#fff',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}