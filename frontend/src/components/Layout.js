import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  parcels: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  track: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  add: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
};

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: 240, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100
  },
  logo: {
    padding: '24px 20px 20px', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', gap: 12
  },
  logoIcon: {
    width: 36, height: 36, background: 'var(--accent)', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  logoText: { fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'var(--text)' },
  logoSub: { fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase' },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  navLabel: { fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '8px 8px 4px', fontFamily: 'var(--font-head)' },
  navLink: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    borderRadius: 8, color: 'var(--text2)', fontSize: 14, fontFamily: 'var(--font-head)',
    fontWeight: 600, transition: 'all 0.15s', cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left'
  },
  navLinkActive: { background: 'rgba(240,192,64,0.12)', color: 'var(--accent)' },
  userSection: {
    padding: '16px', borderTop: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', gap: 12
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%', background: 'var(--accent2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, flexShrink: 0
  },
  userName: { fontSize: 13, fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--text)' },
  userRole: { fontSize: 11, color: 'var(--text2)', textTransform: 'capitalize' },
  main: { flex: 1, marginLeft: 240, minHeight: '100vh' },
  content: { padding: '32px', maxWidth: 1200, margin: '0 auto' }
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', label: 'Tableau de bord', icon: 'dashboard' },
    { to: '/parcels', label: 'Colis', icon: 'parcels' },
    ...(user?.role === 'admin' ? [{ to: '/users', label: 'Utilisateurs', icon: 'users' }] : []),
    { to: '/track', label: 'Suivi public', icon: 'track', external: true }
  ];

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="2.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div>
            <div style={styles.logoText}>ColisTrack</div>
            <div style={styles.logoSub}>Gestion Livraison</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navLabel}>Navigation</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              target={item.external ? '_blank' : undefined}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {})
              })}
            >
              {icons[item.icon]}
              {item.label}
            </NavLink>
          ))}

          <div style={{ ...styles.navLabel, marginTop: 12 }}>Actions</div>
          {(user?.role === 'admin' || user?.role === 'client') && (
            <NavLink to="/parcels/new" style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}>
              {icons.add}
              Nouveau colis
            </NavLink>
          )}
        </nav>

        <div style={styles.userSection}>
          <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
          <button onClick={handleLogout} style={{ ...styles.navLink, padding: 8, width: 'auto' }}>
            {icons.logout}
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
