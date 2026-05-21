import { useState, useEffect } from 'react';

const messages = [
  'Analyzing pitch conditions...',
  'Studying player matchups...',
  'Calculating win probability...',
  'Building bowling rotation...',
  'Finalizing tactical plan...',
];

function SkeletonBlock({ width = '100%', height = 16, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 6, ...style }}
    />
  );
}

export default function LoadingSkeleton() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setMsgIndex((i) => (i + 1) % messages.length),
      1500
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '24px' }} className="page-enter">
      {/* Cycling message */}
      <div style={{
        textAlign: 'center', marginBottom: 32,
        color: '#38bdf8', fontSize: 14, fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold', letterSpacing: '0.05em'
      }}>
        ⚡ {messages[msgIndex]}
      </div>

      {/* Match Overview card skeleton */}
      <div className="cricket-card" style={{ padding: 20, marginBottom: 16 }}>
        <SkeletonBlock width={140} height={14} style={{ marginBottom: 12 }} />
        <SkeletonBlock width="100%" height={12} style={{ marginBottom: 8 }} />
        <SkeletonBlock width="80%" height={12} />
      </div>

      {/* Win Probability skeleton */}
      <div className="cricket-card" style={{ padding: 20, marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SkeletonBlock width={120} height={14} style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
            <SkeletonBlock width={80} height={80} style={{ borderRadius: '50%' }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SkeletonBlock width={120} height={14} style={{ marginBottom: 12 }} />
          <SkeletonBlock width="100%" height={12} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="60%" height={12} />
        </div>
      </div>

      {/* 2-column cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
        {[0, 1].map((i) => (
          <div key={i} className="cricket-card" style={{ padding: 20 }}>
            <SkeletonBlock width={100} height={14} style={{ marginBottom: 12 }} />
            {[0, 1, 2, 3].map((j) => (
              <SkeletonBlock key={j} width={`${85 - j * 8}%`} height={11} style={{ marginBottom: 8 }} />
            ))}
          </div>
        ))}
      </div>

      {/* 3 bottom cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="cricket-card" style={{ padding: 20 }}>
            <SkeletonBlock width={90} height={14} style={{ marginBottom: 12 }} />
            <SkeletonBlock width="100%" height={11} style={{ marginBottom: 8 }} />
            <SkeletonBlock width="70%" height={11} />
          </div>
        ))}
      </div>
    </div>
  );
}
