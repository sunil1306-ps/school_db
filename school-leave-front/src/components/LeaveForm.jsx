// src/components/LeaveForm.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function LeaveForm({ onSuccess }) {
  const { user } = useAuth();
  if (user.role !== 'parent') return null;

  const [reason, setReason] = useState('');
  const [fromD, setFrom] = useState('');
  const [toD, setTo] = useState('');
  const [student, setStu] = useState('');
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
        .get('http://127.0.0.1:8000/accounts/api/my-students/', {
        headers: { Authorization: `Bearer ${user.token}` } // ← add
        })
        .then(res => setKids(res.data));
    }, []);

  const handle = async e => {
    e.preventDefault();
    await axios.post('http://127.0.0.1:8000/api/leave/', {
      student,
      reason,
      from_date: fromD,
      to_date: toD
    });
    onSuccess && onSuccess();
    setReason(''); setFrom(''); setTo(''); setStu('');
  };

  return (
    <form onSubmit={handle} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '.75rem',
      background: '#1f2937',
      border: '1px solid #374151',
      borderRadius: 8,
      padding: '1rem 1.25rem'
    }}>
      <h3 style={{ color: '#e5e7eb', margin: 0, fontSize: '1rem', fontWeight: 600 }}>Request Leave</h3>

      <select required value={student} onChange={e => setStu(e.target.value)} style={{
        padding: '.5rem .75rem',
        borderRadius: 6,
        border: '1px solid #4b5563',
        background: '#111827',
        color: '#e5e7eb',
        outline: 'none'
      }}>
        <option value="">— select student —</option>
        {kids.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
      </select>

      <textarea required placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} style={{
        resize: 'vertical',
        minHeight: 60,
        padding: '.5rem .75rem',
        borderRadius: 6,
        border: '1px solid #4b5563',
        background: '#111827',
        color: '#e5e7eb',
        outline: 'none'
      }} />

      <div style={{ display: 'flex', gap: '.75rem' }}>
        <input required type="date" value={fromD} onChange={e => setFrom(e.target.value)} style={{
          flex: 1, padding: '.5rem .75rem', borderRadius: 6, border: '1px solid #4b5563', background: '#111827', color: '#e5e7eb', outline: 'none'
        }} />
        <input required type="date" value={toD} onChange={e => setTo(e.target.value)} style={{
          flex: 1, padding: '.5rem .75rem', borderRadius: 6, border: '1px solid #4b5563', background: '#111827', color: '#e5e7eb', outline: 'none'
        }} />
      </div>

      <button disabled={loading} style={{
        marginTop: '.25rem',
        padding: '.5rem',
        borderRadius: 6,
        border: 'none',
        background: loading ? '#374151' : '#2563eb',
        color: '#fff',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer'
      }}>
        {loading ? 'Sending…' : 'Submit Request'}
      </button>
    </form>
  );
}