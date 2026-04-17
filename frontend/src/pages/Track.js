import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending: { label: 'En attente de collecte', color: '#f0c040', bg: 'rgba(240,192,64,0.12)', step: 1 },
  picked_up: { label: 'Colis récupéré', color: '#4f9cf9', bg: 'rgba(79,156,249,0.12)', step: 2 },
  in_transit: { label: 'En transit', color: '#9b7fe8', bg: 'rgba(155,127,232,0.12)', step: 3 },
  out_for_delivery: { label: 'En cours de livraison', color: '#f07d26', bg: 'rgba(240,125,38,0.12)', step: 4 },
  delivered: { label: 'Livré avec succès', color: '#2dd4a0', bg: 'rgba(45,212,160,0.12)', step: 5 },
  failed: { label: 'Livraison échouée', color: '#f04f4f', bg: 'rgba(240,79,79,0.12)', step: -1 },
  returned: { label: 'Retourné à l\'expéditeur', color: '#f04f4f', bg: 'rgba(240,79,79,0.12)', step: -1 }
};

const steps = ['En attente', 'Récupéré', 'En transit', 'En livraison', 'Livré'];

const s = {
  page: {
    minHeight: '100vh', background: 'var(--bg)',
    backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(240,192,64,0.08) 0%, transparent 50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px'
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 },
  logoIcon: { width: 44, height: 44, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heading: { fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800, marginBottom: 8, textAlign: 'center' },
  sub: { color: 'var(--text2)', marginBottom: 36, textAlign: 'center' },
  searchBox: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: 6, display: 'flex', gap: 0, width: '100%', maxWidth: 520, marginBottom: 32
  },
  searchInput: { flex: 1, background: 'none', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 15 },
  searchBtn: {
    padding: '10px 24px', background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 8, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, flexShrink: 0
  },
  resultCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: 32, width: '100%', maxWidth: 640
  },
  stepsRow: { display: 'flex', alignItems: 'center', marginBottom: 32 },
  stepDot: { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: 'var(--font-head)', fontWeight: 700, flexShrink: 0 },
  stepLine: { flex: 1, height: 2 },
  error: { color: '#f04f4f', background: 'rgba(240,79,79,0.1)', border: '1px solid rgba(240,79,79,0.3)', padding: '12px 20px', borderRadius: 8 },
  backLink: { color: 'var(--text2)', marginTop: 32, fontSize: 13 },
  linkA: { color: 'var(--accent)', fontFamily: 'var(--font-head)', fontWeight: 600 }
};

export default function Track() {
  const [trackingNum, setTrackingNum] = useState('');
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!trackingNum.trim()) return;
    setLoading(true);
    setError('');
    setParcel(null);
    try {
      const { data } = await axios.get(`/api/parcels/track/${trackingNum.trim()}`);
      setParcel(data);
    } catch (err) {
      setError('Numéro de suivi introuvable. Vérifiez le numéro et réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const sc = parcel ? (statusConfig[parcel.status] || statusConfig.pending) : null;
  const currentStep = sc?.step || 0;

  return (
    <div style={s.page}>
      <div style={s.logo}>
        <div style={s.logoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="2.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20 }}>ColisTrack</div>
        </div>
      </div>

      <h1 style={s.heading}>Suivre mon colis</h1>
      <p style={s.sub}>Entrez votre numéro de suivi pour localiser votre colis</p>

      <div style={s.searchBox}>
        <input
          style={s.searchInput}
          placeholder="TRK1234567890ABCDE"
          value={trackingNum}
          onChange={e => setTrackingNum(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button style={s.searchBtn} onClick={handleSearch} disabled={loading}>
          {loading ? '...' : 'Suivre'}
        </button>
      </div>

      {error && <div style={s.error}>{error}</div>}

      {parcel && (
        <div style={s.resultCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--accent)', marginBottom: 4 }}>{parcel.trackingNumber}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800 }}>Pour {parcel.recipient?.name}</div>
              <div style={{ color: 'var(--text2)', fontSize: 13 }}>{parcel.recipient?.address}, {parcel.recipient?.city}</div>
            </div>
            <span style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontFamily: 'var(--font-head)', fontWeight: 700, color: sc.color, background: sc.bg }}>{sc.label}</span>
          </div>

          {currentStep > 0 && (
            <div style={{ ...s.stepsRow, marginBottom: 32, overflowX: 'auto' }}>
              {steps.map((step, i) => {
                const stepNum = i + 1;
                const active = stepNum <= currentStep;
                return (
                  <React.Fragment key={step}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ ...s.stepDot, background: active ? sc.color : 'var(--bg3)', color: active ? 'var(--bg)' : 'var(--text3)', border: `2px solid ${active ? sc.color : 'var(--border)'}` }}>
                        {stepNum <= currentStep ? '✓' : stepNum}
                      </div>
                      <div style={{ fontSize: 10, color: active ? sc.color : 'var(--text3)', fontFamily: 'var(--font-head)', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>{step}</div>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ ...s.stepLine, background: stepNum < currentStep ? sc.color : 'var(--border)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {parcel.trackingHistory?.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Historique</div>
              {[...parcel.trackingHistory].reverse().map((ev, i) => {
                const evSc = statusConfig[ev.status] || statusConfig.pending;
                return (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: evSc.color, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.description}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{ev.location} — {new Date(ev.timestamp).toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div style={s.backLink}>
        <Link to="/login" style={s.linkA}>Accéder à l'espace de gestion →</Link>
      </div>
    </div>
  );
}
