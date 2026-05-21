import { useState, useEffect } from 'react';

const navItems = [
  { path: '/',           label: 'Home',       icon: '🏠' },
  { path: '/team-analysis', label: 'Teams',   icon: '⚔️' },
  { path: '/strategy',   label: 'Strategy',   icon: '🤖' },
  { path: '/matchups',   label: 'Matchups',   icon: '👤' },
  { path: '/venue',      label: 'Venue',      icon: '🏟️' },
];

export default function Sidebar({ currentPath, onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    // Bottom navigation bar
    return (
      <nav
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: '#0f172a',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px 0 12px',
        }}
        className="no-print"
      >
        {navItems.map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, background: 'none', border: 'none', cursor: 'pointer',
                color: active ? '#38bdf8' : '#64748b',
                fontSize: 10,
                fontFamily: 'Inter, sans-serif',
                transition: 'color 0.15s',
                minWidth: 48,
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Desktop sidebar
  return (
    <aside
      style={{
        width: 220, minHeight: '100vh', position: 'fixed', left: 0, top: 0,
        background: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex', flexDirection: 'column',
        padding: '24px 0',
        zIndex: 40,
      }}
      className="no-print"
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: 22, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#38bdf8' }}>
          🏏 CricStrategy
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
          AI Tactical Engine
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {navItems.map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, border: 'none',
                cursor: 'pointer', marginBottom: 4,
                background: active ? 'rgba(56,189,248,0.1)' : 'transparent',
                color: active ? '#38bdf8' : '#94a3b8',
                fontSize: 14, fontFamily: 'Inter, sans-serif',
                textAlign: 'left',
                transition: 'all 0.15s',
                borderLeft: active ? '3px solid #38bdf8' : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
