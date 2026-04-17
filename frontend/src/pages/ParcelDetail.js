import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 },
  back: { color: 'var(--text2)', fontSize: 13, cursor: 'pointer', marginBottom: 8, display: 'block', fontFamily: 'var(--font-head)' },
  tracking: { fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)', marginBottom: 4 },
  title: { fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 800, marginBottom: 4 },
  badge: { display: 'inline-flex', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontFamily: 'var(--font-head)', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 },
  cardTitle: { fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rowLabel: { fontSize: 13, color: 'var(--text2)' },
  rowValue: { fontSize: 13, fontWeight: 500, textAlign: 'right', maxWidth: '60%' },
  timeline: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 },
  timelineItem: { display: 'flex', gap: 16, marginBottom: 20, position: 'relative' },
  dot: { width: 10, height: 10, borderRadius: '50%', marginTop: 4, flexShrink: 0 },
  line: { position: 'absolute', left: 4, top: 18, bottom: -10, width: 2, background: 'var(--border)' },
  updateSection: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 },
  select: { marginBottom: 12 },
  btn: {
    padding: '10px 24px', background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 8, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13
  },
  secondBtn: {
    padding: '10px 20px', background: 'var(--bg3)', color: 'var(--text2)',
    border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 13
  }
};

export default function ParcelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parcel, setParcel] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/parcels/${id}`),
      user?.role === 'admin' ? axios.get('/api/couriers') : Promise.resolve({ data: [] })
    ]).then(([parcelRes, couriersRes]) => {
      setParcel(parcelRes.data);
      setNewStatus(parcelRes.data.status);
      setCouriers(couriersRes.data);
      setLoading(false);
    });
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      const { data } = await axios.put(`/api/parcels/${id}`, {
        status: newStatus, location: newLocation,
        statusDescription: `Statut mis à jour par ${user?.name}`
      });
      setParcel(data);
    } catch (err) {
      alert('Erreur mise à jour');
    }
  };

  const handleAssignCourier = async () => {
    if (!selectedCourier) return;
    try {
      const { data } = await axios.patch(`/api/parcels/${id}/assign`, { courierId: selectedCourier });
      setParcel(data);
    } catch (err) {
      alert('Erreur assignation');
    }
  };

  if (loading) return <div style={{ color: 'var(--text2)', padding: 40 }}>Chargement...</div>;
  if (!parcel) return <div style={{ color: 'var(--text2)', padding: 40 }}>Colis non trouvé</div>;

  const sc = statusConfig[parcel.status] || statusConfig.pending;
  const canEdit = user?.role === 'admin' || user?.role === 'courier';

  return (
    <div>
      <div style={s.header}>
        <div>
          <span style={s.back} onClick={() => navigate('/parcels')}>← Retour aux colis</span>
          <div style={s.tracking}>{parcel.trackingNumber}</div>
          <h1 style={s.title}>{parcel.recipient?.name}</h1>
        </div>
        <span style={{ ...s.badge, color: sc.color, background: sc.bg }}>{sc.label}</span>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.cardTitle}>Destinataire</div>
          {[
            ['Nom', parcel.recipient?.name],
            ['Téléphone', parcel.recipient?.phone || '—'],
            ['Email', parcel.recipient?.email || '—'],
            ['Adresse', parcel.recipient?.address],
            ['Ville', parcel.recipient?.city || '—'],
          ].map(([label, value]) => (
            <div key={label} style={s.row}>
              <span style={s.rowLabel}>{label}</span>
              <span style={s.rowValue}>{value}</span>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Informations colis</div>
          {[
            ['Description', parcel.description || '—'],
            ['Poids', parcel.weight ? `${parcel.weight} kg` : '—'],
            ['Prix', parcel.price ? `${parcel.price} DZD` : '—'],
            ['Priorité', parcel.priority],
            ['Expéditeur', parcel.sender?.name || '—'],
            ['Livreur', parcel.courier?.name || 'Non assigné'],
            ['Créé le', new Date(parcel.createdAt).toLocaleDateString('fr-FR')],
          ].map(([label, value]) => (
            <div key={label} style={s.row}>
              <span style={s.rowLabel}>{label}</span>
              <span style={s.rowValue}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={s.timeline}>
        <div style={{ ...s.cardTitle, marginBottom: 20 }}>Historique de suivi</div>
        {parcel.trackingHistory?.length > 0 ? (
          [...parcel.trackingHistory].reverse().map((event, i) => {
            const eventSc = statusConfig[event.status] || statusConfig.pending;
            return (
              <div key={i} style={{ ...s.timelineItem }}>
                {i < parcel.trackingHistory.length - 1 && <div style={s.line} />}
                <div style={{ ...s.dot, background: eventSc.color }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{event.description}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{event.location} — {new Date(event.timestamp).toLocaleString('fr-FR')}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ color: 'var(--text2)', fontSize: 13 }}>Aucun événement de suivi</div>
        )}
      </div>

      {canEdit && (
        <div style={s.updateSection}>
          <div style={{ ...s.cardTitle, marginBottom: 16 }}>Mettre à jour</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.05em' }}>NOUVEAU STATUT</div>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {Object.entries(statusConfig).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.05em' }}>LOCALISATION</div>
              <input placeholder="Ex: Entrepôt Alger..." value={newLocation} onChange={e => setNewLocation(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={s.btn} onClick={handleUpdateStatus}>Mettre à jour le statut</button>
          </div>

          {user?.role === 'admin' && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.05em' }}>ASSIGNER UN LIVREUR</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <select value={selectedCourier} onChange={e => setSelectedCourier(e.target.value)} style={{ maxWidth: 260 }}>
                  <option value="">— Choisir un livreur —</option>
                  {couriers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.phone || c.email})</option>
                  ))}
                </select>
                <button style={s.secondBtn} onClick={handleAssignCourier}>Assigner</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
