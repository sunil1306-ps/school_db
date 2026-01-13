// src/components/LeaveList.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import useLeaveLive from '../hooks/useLeaveLive';

export default function LeaveList() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);

  const fetch = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/leave/');
    setRows(res.data);
  };

  useEffect(() => {fetch();}, []);

  useLeaveLive((newLeave) => {
    console.log('📨 React received', newLeave); 
    setRows(prev => {
      const copy = prev.map(r => (r.id === newLeave.id ? newLeave : r));
      if (!copy.find(r => r.id === newLeave.id)) copy.unshift(newLeave);
      return copy;
    });
  });

  const approve = async (id) => {
    await axios.patch(`http://127.0.0.1:8000/api/leave/${id}/status/`, { status: 'approved' });
  };
  const reject = async (id) => {
    await axios.patch(`http://127.0.0.1:8000/api/leave/${id}/status/`, { status: 'rejected' });
  };

  if (!rows.length) return <p>Loading…</p>;

    return (
    <div className="leave-table-wrapper">
      <table className="leave-table teacher">
        <thead>
          <tr>
            <th>Student</th>
            <th>Reason</th>
            <th>From → To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className={`status-${r.status}`}>
              <td>{r.student_name}</td>
              <td>{r.reason}</td>
              <td>{r.from_date} → {r.to_date}</td>
              <td><span className={`pill ${r.status}`}>{r.status}</span></td>
              {user.role==='teacher' && (
                <td>
                    {r.status==='pending' && (
                    <div className="action-buttons">
                        <button className="approve" onClick={()=>approve(r.id)}>✔ Approve</button>
                        <button className="reject"  onClick={()=>reject(r.id)}>✘ Reject</button>
                    </div>
                    )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}