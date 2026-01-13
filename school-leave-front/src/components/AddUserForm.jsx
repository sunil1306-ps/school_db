import { useState } from 'react';
import axios from 'axios';

export default function AddUserForm() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'student', parent_email: ''
  });
  const [msg, setMsg] = useState('');

  const handle = e => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/accounts/register/', form)
      .then(() => {
        setMsg('✅ User created');
        setForm({ username: '', email: '', password: '', role: 'student', parent_email: '' });
      })
      .catch(err => setMsg('❌ ' + (err.response?.data?.detail || 'Error')));
  };

  return (
    <form className="add-user-form" onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
      <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />

      <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="parent">Parent</option>
      </select>

      <input placeholder="Parent email (if student)" value={form.parent_email} onChange={e => setForm({...form, parent_email: e.target.value})} />

      <button type="submit" style={{
        marginTop: '.5rem',
        padding: '.5rem 1rem',
        borderRadius: 6,
        border: 'none',
        background: '#2563eb',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer'
    }}
      >Create User</button>
      {msg && <p className="form-msg">{msg}</p>}
    </form>
  );
}