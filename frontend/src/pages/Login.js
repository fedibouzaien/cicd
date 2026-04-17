import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg)',
    backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(240,192,64,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(79,156,249,0.05) 0%, transparent 60%)'
  },
  card: {
    width: '100%', maxWidth: 420, padding: '40px',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)'
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 },
  logoIcon: {
    width: 44, height: 44, background: 'var(--accent)', borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  title: { fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, marginBottom: 6 },
  subtitle: { color: 'var(--text2)', fontSize: 14, marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.05em' },
  btn: {
    width: '100%', padding: '12px', background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 8, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15,
    border: 'none', cursor: 'pointer', marginTop: 8, transition: 'opacity 0.2s'
  },
  error: { background: 'rgba(240,79,79,0.12)', border: '1px solid rgba(240,79,79,0.3)', color: '#f04f4f', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  link: { textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text2)' },
  linkA: { color: 'var(--accent)', fontWeight: 600 }
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="2.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 18 }}>ColisTrack</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', letterSpacing: '0.1em' }}>GESTION LIVRAISON</div>
          </div>
        </div>

        <h1 style={s.title}>Bienvenue</h1>
        <p style={s.subtitle}>Connectez-vous à votre espace</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>ADRESSE EMAIL</label>
            <input type="email" placeholder="exemple@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>MOT DE PASSE</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={s.link}>
          Pas de compte ? <Link to="/register" style={s.linkA}>S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}
