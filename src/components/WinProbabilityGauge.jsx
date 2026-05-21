import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function WinProbabilityGauge({ teamA, teamB, probability, confidence }) {
  // Ensure default fallback percentages if data is loading/missing
  const probA = Math.round(probability?.teamA || 50);
  const probB = Math.round(probability?.teamB || 50);
  const confText = confidence || 'Medium';

  // Format data for Recharts RadialBarChart
  // We add a dummy 100% background ring so the visual looks complete
  const chartData = [
    {
      name: teamB?.name || 'Team B',
      value: probB,
      fill: '#fbbf24', // Amber
    },
    {
      name: teamA?.name || 'Team A',
      value: probA,
      fill: '#38bdf8', // Cyan
    }
  ];

  return (
    <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl flex flex-col items-center justify-between h-full hover:border-cricket-cyan/30 transition-all duration-300">
      <h3 className="text-lg font-bold font-display text-slate-300 uppercase tracking-wider mb-2">
        Win Projection
      </h3>

      <div className="relative w-full h-48 flex items-center justify-center">
        {/* Center Labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className="text-3xl font-bold font-display text-white">
            {probA}% vs {probB}%
          </span>
          <span className="text-[10px] uppercase font-display tracking-widest text-slate-400 font-bold mt-1">
            {teamA?.shortName || 'TMA'} vs {teamB?.shortName || 'TMB'}
          </span>
        </div>

        {/* Recharts Chart */}
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="100%"
            barSize={10}
            data={chartData}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              minAngle={15}
              background={{ fill: '#1e293b' }}
              clockWise
              dataKey="value"
              cornerRadius={5}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Pill Badge */}
      <div className="mt-4 flex flex-col items-center gap-1 w-full border-t border-cricket-border pt-4">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          AI Confidence Rating
        </span>
        <span className={`px-4 py-1 rounded-full text-xs font-bold font-display uppercase tracking-widest border ${
          confText.toLowerCase() === 'high' 
            ? 'bg-cricket-green/10 text-cricket-green border-cricket-green/30'
            : confText.toLowerCase() === 'medium'
            ? 'bg-cricket-cyan/10 text-cricket-cyan border-cricket-cyan/30'
            : 'bg-cricket-amber/10 text-cricket-amber border-cricket-amber/30'
        }`}>
          {confText} Confidence
        </span>
      </div>
    </div>
  );
}
