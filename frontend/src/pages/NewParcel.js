import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const s = {
  title: { fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, marginBottom: 6 },
  subtitle: { color: 'var(--text2)', marginBottom: 32, fontSize: 14 },
  form: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 32, maxWidth: 700
  },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
    paddingBottom: 10, borderBottom: '1px solid var(--border)'
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: 6, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.05em' },
  btns: { display: 'flex', gap: 12, marginTop: 24 },
  submitBtn: {
    padding: '12px 32px', background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 8, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14
  },
  cancelBtn: {
    padding: '12px 24px', background: 'var(--bg3)', color: 'var(--text2)',
    border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14
  },
  error: { background: 'rgba(240,79,79,0.12)', border: '1px solid rgba(240,79,79,0.3)', color: '#f04f4f', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 20 }
};

export default function NewParcel() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    'recipient.name': '', 'recipient.phone': '', 'recipient.email': '',
    'recipient.address': '', 'recipient.city': '',
    description: '', weight: '', price: '', priority: 'standard', notes: '',
    'dimensions.length': '', 'dimensions.width': '', 'dimensions.height': ''
  });

  const upd = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        recipient: {
          name: form['recipient.name'], phone: form['recipient.phone'],
          email: form['recipient.email'], address: form['recipient.address'],
          city: form['recipient.city']
        },
        description: form.description, weight: form.weight, price: form.price,
        priority: form.priority, notes: form.notes,
        dimensions: {
          length: form['dimensions.length'], width: form['dimensions.width'],
          height: form['dimensions.height']
        }
      };
      const { data } = await axios.post('/api/parcels', payload);
      navigate(`/parcels/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={s.title}>Nouveau colis</h1>
      <p style={s.subtitle}>Remplissez les informations pour créer un nouveau colis</p>

      {error && <div style={s.error}>{error}</div>}

      <form style={s.form} onSubmit={handleSubmit}>
        <div style={s.section}>
          <div style={s.sectionTitle}>Informations destinataire</div>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>NOM COMPLET *</label>
              <input placeholder="Prénom Nom" value={form['recipient.name']} onChange={e => upd('recipient.name', e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>TÉLÉPHONE</label>
              <input placeholder="+213 XXX XXX" value={form['recipient.phone']} onChange={e => upd('recipient.phone', e.target.value)} />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>EMAIL</label>
            <input type="email" placeholder="email@exemple.com" value={form['recipient.email']} onChange={e => upd('recipient.email', e.target.value)} />
          </div>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>ADRESSE *</label>
              <input placeholder="Rue, Numéro..." value={form['recipient.address']} onChange={e => upd('recipient.address', e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>VILLE</label>
              <input placeholder="Alger, Oran..." value={form['recipient.city']} onChange={e => upd('recipient.city', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>Détails du colis</div>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>DESCRIPTION</label>
              <input placeholder="Contenu du colis..." value={form.description} onChange={e => upd('description', e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>PRIORITÉ</label>
              <select value={form.priority} onChange={e => upd('priority', e.target.value)}>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div style={s.grid3}>
            <div style={s.field}>
              <label style={s.label}>POIDS (KG)</label>
              <input type="number" step="0.1" placeholder="0.5" value={form.weight} onChange={e => upd('weight', e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>PRIX (DZD)</label>
              <input type="number" placeholder="500" value={form.price} onChange={e => upd('price', e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>LONGUEUR (CM)</label>
              <input type="number" placeholder="20" value={form['dimensions.length']} onChange={e => upd('dimensions.length', e.target.value)} />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>NOTES INTERNES</label>
            <textarea placeholder="Remarques, instructions spéciales..." rows="3" value={form.notes} onChange={e => upd('notes', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
        </div>

        <div style={s.btns}>
          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? 'Création...' : 'Créer le colis'}
          </button>
          <button type="button" style={s.cancelBtn} onClick={() => navigate('/parcels')}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
