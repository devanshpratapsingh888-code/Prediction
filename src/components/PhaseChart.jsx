import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PhaseChart({ teamA, teamB, phaseDataA, phaseDataB }) {
  // Format data for Recharts BarChart
  const data = [
    {
      phase: 'Powerplay (Overs 1-6)',
      [teamA?.name || 'Team A']: phaseDataA?.powerplay || 48,
      [teamB?.name || 'Team B']: phaseDataB?.powerplay || 45,
    },
    {
      phase: 'Middle (Overs 7-15)',
      [teamA?.name || 'Team A']: phaseDataA?.middleOvers || 75,
      [teamB?.name || 'Team B']: phaseDataB?.middleOvers || 72,
    },
    {
      phase: 'Death (Overs 16-20)',
      [teamA?.name || 'Team A']: phaseDataA?.deathOvers || 44,
      [teamB?.name || 'Team B']: phaseDataB?.deathOvers || 40,
    }
  ];

  return (
    <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition-all duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">
          Game Phase Comparisons
        </h3>
        <p className="text-xs text-slate-400">
          Expected average run contributions per phase based on current team squads
        </p>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="phase" 
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 'bold' }} 
              stroke="#1e293b"
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              stroke="#1e293b"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0a0f1e',
                borderColor: '#1e293b',
                borderRadius: '12px',
                color: '#f8fafc',
                fontFamily: 'Inter',
                fontSize: '12px'
              }}
              cursor={{ fill: 'rgba(30, 41, 59, 0.3)' }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontFamily: 'Rajdhani',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            />
            <Bar 
              dataKey={teamA?.name || 'Team A'} 
              fill="#38bdf8" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1200}
            />
            <Bar 
              dataKey={teamB?.name || 'Team B'} 
              fill="#fbbf24" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
