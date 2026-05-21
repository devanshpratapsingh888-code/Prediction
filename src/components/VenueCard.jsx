import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Compass, Landmark, Wind, BarChart2 } from 'lucide-react';

export default function VenueCard({ venue }) {
  if (!venue) return null;

  // Pace vs Spin split data for Recharts Pie
  const pacePct = venue.paceEffectiveness || 50;
  const spinPct = venue.spinEffectiveness || 50;
  
  const chartData = [
    { name: 'Pace', value: pacePct, color: '#38bdf8' }, // Cyan
    { name: 'Spin', value: spinPct, color: '#fbbf24' }  // Amber
  ];

  const chasePct = venue.chasingSuccessPct || 50;
  const defendPct = 100 - chasePct;

  return (
    <div className="bg-cricket-card rounded-2xl border border-cricket-border shadow-xl p-6 space-y-6 hover:border-cricket-cyan/20 transition-all duration-300 fade-in">
      
      {/* Venue Header */}
      <div className="flex justify-between items-start border-b border-cricket-border pb-4">
        <div>
          <h3 className="text-2xl font-bold font-display text-white tracking-wide">
            {venue.name}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            📍 {venue.city}, {venue.country}
          </span>
        </div>
        <div className="bg-cricket-cyan/10 border border-cricket-cyan/30 rounded-xl p-2 text-cricket-cyan">
          <Landmark className="w-5 h-5" />
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Avg First Innings T20</span>
          <p className="text-xl font-bold font-display text-white mt-1">{venue.avgFirstInningsT20} runs</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Avg First Innings ODI</span>
          <p className="text-xl font-bold font-display text-white mt-1">{venue.avgFirstInningsODI} runs</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Dew Factor</span>
          <p className="text-xl font-bold font-display text-cricket-cyan mt-1">{venue.dewFactor}</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Pitch Surface</span>
          <p className="text-xl font-bold font-display text-cricket-amber mt-1">{venue.pitchType}</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Pace vs Spin Donut */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <Wind className="w-4 h-4 text-cricket-cyan" />
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
              Pace vs Spin Bowling Split
            </h4>
          </div>

          <div className="w-full h-40 relative flex items-center justify-center">
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className="text-sm font-bold font-display text-white">EFFECTIVENESS</span>
              <span className="text-[10px] text-slate-400 font-medium">{pacePct}% / {spinPct}%</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0f1e',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontFamily: 'Inter',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-4 mt-2 font-display text-xs font-bold uppercase">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cricket-cyan inline-block"></span>
              <span className="text-slate-300">Pace ({pacePct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cricket-amber inline-block"></span>
              <span className="text-slate-300">Spin ({spinPct}%)</span>
            </div>
          </div>
        </div>

        {/* Chasing vs Defending Win % */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-cricket-cyan" />
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
              Chasing vs Defending Match Win Ratio
            </h4>
          </div>

          <div className="space-y-4 my-auto">
            <div className="flex justify-between text-xs font-bold font-display">
              <span className="text-cricket-cyan uppercase">Chasing Wins</span>
              <span className="text-white text-sm">{chasePct}%</span>
            </div>
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex p-[2px]">
              <div 
                style={{ width: `${chasePct}%` }} 
                className="bg-cricket-cyan h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
              ></div>
            </div>

            <div className="flex justify-between text-xs font-bold font-display">
              <span className="text-cricket-amber uppercase">Defending Wins</span>
              <span className="text-white text-sm">{defendPct}%</span>
            </div>
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex p-[2px]">
              <div 
                style={{ width: `${defendPct}%` }} 
                className="bg-cricket-amber h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
              ></div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-medium leading-relaxed border-t border-slate-800/60 pt-3 mt-4">
            * Based on historically recorded match outcomes at this location.
          </div>
        </div>
      </div>

      {/* Boundary & Pitch Notes */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-xs font-display font-bold">
          <span className="text-slate-400 uppercase">Boundary Dimension:</span>
          <span className="text-cricket-cyan uppercase tracking-wider">{venue.boundarySize} Size</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          <span className="font-semibold text-slate-200">Ground Overview & Tactical Info:</span> {venue.notes}
        </p>
      </div>

    </div>
  );
}
