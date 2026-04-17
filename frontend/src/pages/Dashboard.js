import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  pending: { label: 'En attente', color: '#f0c040', bg: 'rgba(240,192,64,0.12)' },
  picked_up: { label: 'Récupéré', color: '#4f9cf9', bg: 'rgba(79,156,249,0.12)' },
  in_transit: { label: 'En transit', color: '#9b7fe8', bg: 'rgba(155,127,232,0.12)' },
  out_for_delivery: { label: 'En livraison', color: '#f07d26', bg: 'rgba(240,125,38,0.12)' },
  delivered: { label: 'Livré', color: '#2dd4a0', bg: 'rgba(45,212,160,0.12)' },
  failed: { label: 'Échoué', color: '#f04f4f', bg: 'rgba(240,79,79,0.12)' },
  returned: { label: 'Retourné', color: '#f04f4f', bg: 'rgba(240,79,79,0.12)' }
};

const s = {
  header: { marginBottom: 32 },
  title: { fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 800, marginBottom: 6 },
  subtitle: { color: 'var(--text2)', fontSize: 15 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 },
  stat: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: '24px 20px', position: 'relative', overflow: 'hidden'
  },
  statAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  statNum: { fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800, marginBottom: 4 },
  statLabel: { color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--font-head)', fontWeight: 600 },
  section: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24
  },
  sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700 },
  viewAll: { color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--font-head)', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.1em', padding: '0 12px 12px 0', textTransform: 'uppercase' },
  td: { padding: '12px 12px 12px 0', borderTop: '1px solid var(--border)', fontSize: 13 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'var(--font-head)', fontWeight: 600 },
  tracking: { fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)' },
  loader: { color: 'var(--text2)', textAlign: 'center', padding: 40 }
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios.get('/api/dashboard/stats').then(r => {
      setStats(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.loader}>Chargement...</div>;

  const statCards = [
    { label: 'Total Colis', value: stats?.total || 0, color: '#4f9cf9' },
    { label: 'En attente', value: stats?.pending || 0, color: '#f0c040' },
    { label: 'En transit', value: stats?.in_transit || 0, color: '#9b7fe8' },
    { label: 'Livrés', value: stats?.delivered || 0, color: '#2dd4a0' },
    { label: 'Échoués', value: stats?.failed || 0, color: '#f04f4f' },
    ...(user?.role === 'admin' ? [{ label: 'Utilisateurs', value: stats?.totalUsers || 0, color: '#f07d26' }] : [])
  ];

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Tableau de bord</h1>
        <p style={s.subtitle}>Bonjour {user?.name} — voici un aperçu de votre activité</p>
      </div>

      <div style={s.statsGrid}>
        {statCards.map(card => (
          <div key={card.label} style={s.stat}>
            <div style={{ ...s.statAccent, background: card.color }} />
            <div style={{ ...s.statNum, color: card.color }}>{card.value}</div>
            <div style={s.statLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}>Derniers colis</h2>
          <Link to="/parcels" style={s.viewAll}>Voir tout →</Link>
        </div>
        {stats?.recentParcels?.length > 0 ? (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Numéro</th>
                <th style={s.th}>Destinataire</th>
                <th style={s.th}>Ville</th>
                <th style={s.th}>Statut</th>
                <th style={s.th}>Livreur</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentParcels.map(p => {
                const sc = statusConfig[p.status] || statusConfig.pending;
                return (
                  <tr key={p._id}>
                    <td style={s.td}>
                      <Link to={`/parcels/${p._id}`} style={{ ...s.tracking, color: 'var(--accent)' }}>{p.trackingNumber}</Link>
                    </td>
                    <td style={s.td}>{p.recipient?.name}</td>
                    <td style={s.td} >{p.recipient?.city || '—'}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, color: sc.color, background: sc.bg }}>{sc.label}</span>
                    </td>
                    <td style={{ ...s.td, color: 'var(--text2)' }}>{p.courier?.name || 'Non assigné'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ color: 'var(--text2)', textAlign: 'center', padding: '32px 0' }}>Aucun colis pour l'instant</div>
        )}
      </div>
    </div>
  );
}
