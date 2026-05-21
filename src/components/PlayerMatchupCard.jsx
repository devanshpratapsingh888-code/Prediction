import React from 'react';
import { getMatchupStats } from '../utils/cricketHelpers';
import { Award, Zap, Crosshair } from 'lucide-react';

export default function PlayerMatchupCard({ batter, bowler }) {
  if (!batter || !bowler) return null;

  const stats = getMatchupStats(batter, bowler);

  const statItems = [
    { label: 'Runs Scored', value: stats.runs, max: 200, unit: ' runs' },
    { label: 'Balls Faced', value: stats.balls, max: 150, unit: ' balls' },
    { label: 'Times Dismissed', value: stats.dismissals, max: 10, unit: ' times' },
    { label: 'Strike Rate', value: stats.strikeRate, max: 250, unit: '' },
    { label: 'Dot Ball %', value: stats.dotBallPct, max: 100, unit: '%' },
    { label: 'Boundary %', value: stats.boundaryPct, max: 50, unit: '%' }
  ];

  return (
    <div className="bg-cricket-card rounded-2xl border border-cricket-border shadow-xl overflow-hidden hover:border-cricket-cyan/20 transition-all duration-300 fade-in">
      {/* Clash Header */}
      <div className="bg-gradient-to-r from-cricket-cyan/5 via-slate-900 to-cricket-amber/5 p-6 border-b border-cricket-border flex justify-between items-center text-center">
        {/* Batter Profile */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-cricket-cyan/15 border border-cricket-cyan/30 flex items-center justify-center text-xl mb-2">
            🏏
          </div>
          <h4 className="text-base font-bold font-display text-white">{batter.name}</h4>
          <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{batter.role} ({batter.battingHand} Hand)</span>
          <div className="mt-2 flex gap-1 items-center bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span className="text-[10px] font-bold text-cricket-cyan uppercase font-display">Form: {batter.formRating}</span>
          </div>
        </div>

        <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 font-display text-xs font-bold uppercase tracking-widest">
          VS
        </div>

        {/* Bowler Profile */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-cricket-amber/15 border border-cricket-amber/30 flex items-center justify-center text-xl mb-2">
            🥎
          </div>
          <h4 className="text-base font-bold font-display text-white">{bowler.name}</h4>
          <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{bowler.bowlingType || 'Medium Pace'}</span>
          <div className="mt-2 flex gap-1 items-center bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span className="text-[10px] font-bold text-cricket-amber uppercase font-display">Form: {bowler.formRating}</span>
          </div>
        </div>
      </div>

      {/* Duel Statistics Content */}
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Crosshair className="w-4 h-4 text-cricket-cyan" />
          <h5 className="text-xs font-bold tracking-wider uppercase font-display text-slate-300">
            Simulated Head-to-Head Duel Stats
          </h5>
        </div>

        {/* Dynamic Comparison Progress Bars */}
        <div className="space-y-4">
          {statItems.map((item, idx) => {
            const pct = Math.min((item.value / item.max) * 100, 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400 uppercase font-display text-[11px] tracking-wider">{item.label}</span>
                  <span className="text-cricket-cyan font-mono text-[11px]">{item.value}{item.unit}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${pct}%` }} 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      item.label.includes('Dismissed') || item.label.includes('Dot')
                        ? 'bg-cricket-amber shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                        : 'bg-cricket-cyan shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strengths & Weaknesses quick display */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
          <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-display block mb-1">
              Batter Weaknesses
            </span>
            <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
              {batter.weaknesses.slice(0, 2).map((w, i) => (
                <li key={i} className="truncate capitalize">{w}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-display block mb-1">
              Bowler Strengths
            </span>
            <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
              {bowler.strengths.slice(0, 2).map((s, i) => (
                <li key={i} className="truncate capitalize">{s}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
