import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg)',
    backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(240,192,64,0.05) 0%, transparent 60%)'
  },
  card: {
    width: '100%', maxWidth: 460, padding: '40px',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)'
  },
  title: { fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800, marginBottom: 6 },
  subtitle: { color: 'var(--text2)', fontSize: 14, marginBottom: 28 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: 6, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.05em' },
  btn: {
    width: '100%', padding: '12px', background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 8, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15,
    border: 'none', cursor: 'pointer', marginTop: 8
  },
  error: { background: 'rgba(240,79,79,0.12)', border: '1px solid rgba(240,79,79,0.3)', color: '#f04f4f', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  link: { textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text2)' },
  linkA: { color: 'var(--accent)', fontWeight: 600 }
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const upd = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Créer un compte</h1>
        <p style={s.subtitle}>Rejoignez ColisTrack pour gérer vos livraisons</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>NOM COMPLET</label>
              <input placeholder="Jean Dupont" value={form.name} onChange={e => upd('name', e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>RÔLE</label>
              <select value={form.role} onChange={e => upd('role', e.target.value)}>
                <option value="client">Client</option>
                <option value="courier">Livreur</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>EMAIL</label>
            <input type="email" placeholder="email@exemple.com" value={form.email} onChange={e => upd('email', e.target.value)} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>MOT DE PASSE</label>
            <input type="password" placeholder="Minimum 6 caractères" value={form.password} onChange={e => upd('password', e.target.value)} required />
          </div>

          <div style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>TÉLÉPHONE</label>
              <input placeholder="+213 XXX XXX XXX" value={form.phone} onChange={e => upd('phone', e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>ADRESSE</label>
              <input placeholder="Ville, Pays" value={form.address} onChange={e => upd('address', e.target.value)} />
            </div>
          </div>

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>

        <div style={s.link}>
          Déjà inscrit ? <Link to="/login" style={s.linkA}>Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
