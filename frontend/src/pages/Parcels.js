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

const priorityConfig = {
  standard: { label: 'Standard', color: 'var(--text2)' },
  express: { label: 'Express', color: '#f07d26' },
  urgent: { label: 'Urgent', color: '#f04f4f' }
};

const s = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  title: { fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800 },
  newBtn: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
    background: 'var(--accent)', color: 'var(--bg)', borderRadius: 8,
    fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, textDecoration: 'none'
  },
  filters: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  searchBox: { flex: 1, minWidth: 200, maxWidth: 320 },
  filterSelect: { width: 'auto', minWidth: 140 },
  table: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden'
  },
  tableEl: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.1em', padding: '14px 16px', textTransform: 'uppercase', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' },
  td: { padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: 13, verticalAlign: 'middle' },
  badge: { display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 600 },
  tracking: { fontFamily: 'monospace', color: 'var(--accent)', fontSize: 12 },
  actionBtn: {
    padding: '6px 14px', borderRadius: 6, background: 'var(--bg3)', color: 'var(--text2)',
    border: '1px solid var(--border)', fontSize: 12, fontFamily: 'var(--font-head)', fontWeight: 600, cursor: 'pointer'
  },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text2)' }
};

export default function Parcels() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await axios.get('/api/parcels', { params });
      setParcels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParcels(); }, [search, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce colis ?')) return;
    await axios.delete(`/api/parcels/${id}`);
    setParcels(parcels.filter(p => p._id !== id));
  };

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Colis</h1>
        {(user?.role === 'admin' || user?.role === 'client') && (
          <Link to="/parcels/new" style={s.newBtn}>
            <span>+</span> Nouveau colis
          </Link>
        )}
      </div>

      <div style={s.filters}>
        <div style={s.searchBox}>
          <input placeholder="Rechercher (numéro, destinataire, ville)..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={s.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {Object.entries(statusConfig).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      <div style={s.table}>
        {loading ? (
          <div style={s.empty}>Chargement...</div>
        ) : parcels.length === 0 ? (
          <div style={s.empty}>Aucun colis trouvé</div>
        ) : (
          <table style={s.tableEl}>
            <thead>
              <tr>
                <th style={s.th}>Numéro de suivi</th>
                <th style={s.th}>Destinataire</th>
                <th style={s.th}>Ville</th>
                <th style={s.th}>Priorité</th>
                <th style={s.th}>Statut</th>
                <th style={s.th}>Livreur</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map(p => {
                const sc = statusConfig[p.status] || statusConfig.pending;
                const pc = priorityConfig[p.priority] || priorityConfig.standard;
                return (
                  <tr key={p._id} style={{ transition: 'background 0.1s' }}>
                    <td style={s.td}>
                      <span style={s.tracking}>{p.trackingNumber}</span>
                    </td>
                    <td style={s.td}>
                      <div style={{ fontWeight: 500 }}>{p.recipient?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{p.recipient?.phone}</div>
                    </td>
                    <td style={{ ...s.td, color: 'var(--text2)' }}>{p.recipient?.city || '—'}</td>
                    <td style={s.td}>
                      <span style={{ color: pc.color, fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 12 }}>{pc.label}</span>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, color: sc.color, background: sc.bg }}>{sc.label}</span>
                    </td>
                    <td style={{ ...s.td, color: 'var(--text2)', fontSize: 12 }}>{p.courier?.name || 'Non assigné'}</td>
                    <td style={{ ...s.td, color: 'var(--text2)', fontSize: 12 }}>
                      {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/parcels/${p._id}`} style={{ ...s.actionBtn, textDecoration: 'none' }}>Détails</Link>
                        {(user?.role === 'admin') && (
                          <button style={{ ...s.actionBtn, color: '#f04f4f', borderColor: 'rgba(240,79,79,0.3)' }}
                            onClick={() => handleDelete(p._id)}>Suppr.</button>
                        )}
                      </div>
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
