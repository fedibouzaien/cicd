import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const roleColors = {
  admin: { color: '#f04f4f', bg: 'rgba(240,79,79,0.12)' },
  courier: { color: '#4f9cf9', bg: 'rgba(79,156,249,0.12)' },
  client: { color: '#2dd4a0', bg: 'rgba(45,212,160,0.12)' }
};

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800 },
  table: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  tableEl: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.1em', padding: '14px 16px', textTransform: 'uppercase', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' },
  td: { padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: 13, verticalAlign: 'middle' },
  badge: { display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 700 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, flexShrink: 0 },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text2)' }
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return; }
    axios.get('/api/auth/users').then(r => { setUsers(r.data); setLoading(false); });
  }, []);

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Utilisateurs</h1>
        <div style={{ color: 'var(--text2)', fontSize: 13 }}>{users.length} utilisateur(s) inscrit(s)</div>
      </div>

      <div style={s.table}>
        {loading ? (
          <div style={s.empty}>Chargement...</div>
        ) : (
          <table style={s.tableEl}>
            <thead>
              <tr>
                <th style={s.th}>Utilisateur</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Téléphone</th>
                <th style={s.th}>Rôle</th>
                <th style={s.th}>Adresse</th>
                <th style={s.th}>Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const rc = roleColors[u.role] || roleColors.client;
                return (
                  <tr key={u._id}>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ ...s.avatar, background: u.role === 'admin' ? '#f04f4f' : u.role === 'courier' ? '#4f9cf9' : '#2dd4a0' }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, color: 'var(--text2)' }}>{u.email}</td>
                    <td style={{ ...s.td, color: 'var(--text2)' }}>{u.phone || '—'}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, color: rc.color, background: rc.bg }}>{u.role}</span>
                    </td>
                    <td style={{ ...s.td, color: 'var(--text2)', fontSize: 12 }}>{u.address || '—'}</td>
                    <td style={{ ...s.td, color: 'var(--text2)', fontSize: 12 }}>
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
