import React from 'react';
import { getHeadToHead } from '../utils/cricketHelpers';
import { ShieldCheck, Flame, Compass } from 'lucide-react';

export default function TeamComparisonCard({ teamA, teamB }) {
  if (!teamA || !teamB) return null;

  const h2h = getHeadToHead(teamA, teamB);

  // Form Badge Renderer
  const renderFormBadge = (result, idx) => {
    const isWin = result === 'W';
    return (
      <span
        key={idx}
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-display leading-none border select-none ${
          isWin
            ? 'bg-cricket-green/15 text-cricket-green border-cricket-green/30'
            : 'bg-cricket-red/15 text-cricket-red border-cricket-red/30'
        }`}
      >
        {result}
      </span>
    );
  };

  return (
    <div className="bg-cricket-card rounded-2xl border border-cricket-border shadow-xl overflow-hidden fade-in">
      {/* Header Flag Clash */}
      <div className="bg-gradient-to-r from-cricket-cyan/10 via-slate-900/60 to-cricket-amber/10 p-6 border-b border-cricket-border flex justify-between items-center text-center">
        <div className="flex-1 flex flex-col items-center">
          <span className="text-4xl filter drop-shadow mb-1">{teamA.flag}</span>
          <h4 className="text-lg font-bold font-display text-white">{teamA.name}</h4>
          <span className="text-xs text-cricket-cyan font-bold tracking-wider font-display uppercase">{teamA.shortName}</span>
        </div>
        
        <div className="px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl font-display font-bold text-slate-400 text-sm tracking-widest uppercase">
          VS
        </div>

        <div className="flex-1 flex flex-col items-center">
          <span className="text-4xl filter drop-shadow mb-1">{teamB.flag}</span>
          <h4 className="text-lg font-bold font-display text-white">{teamB.name}</h4>
          <span className="text-xs text-cricket-amber font-bold tracking-wider font-display uppercase">{teamB.shortName}</span>
        </div>
      </div>

      {/* Main Comparisons Content */}
      <div className="p-6 space-y-6">
        
        {/* Head-to-Head Statistics row */}
        <div className="bg-slate-900/50 rounded-xl border border-cricket-border p-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Compass className="w-4 h-4 text-cricket-cyan" />
            <h5 className="text-xs font-bold tracking-wider uppercase font-display">Historical Head-to-Head</h5>
          </div>
          <div className="grid grid-cols-3 text-center border-t border-slate-800/60 pt-3">
            <div>
              <span className="text-2xl font-bold font-display text-cricket-cyan">{h2h.winsA}</span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">{teamA.shortName} Wins</p>
            </div>
            <div className="border-x border-slate-850">
              <span className="text-2xl font-bold font-display text-slate-400">{h2h.draws}</span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">No Result</p>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-cricket-amber">{h2h.winsB}</span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">{teamB.shortName} Wins</p>
            </div>
          </div>
        </div>

        {/* Strength Progress Meters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-cricket-cyan" />
            <h5 className="text-xs font-bold tracking-wider uppercase font-display">Squad Rating Analysis</h5>
          </div>

          {/* Batting Strength */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-display tracking-wider font-bold">
              <span className="text-cricket-cyan">{teamA.battingStrength}%</span>
              <span className="text-slate-300 uppercase">BATTING STRENGTH</span>
              <span className="text-cricket-amber">{teamB.battingStrength}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${teamA.battingStrength / 2}%` }} className="bg-cricket-cyan h-full rounded-l-full"></div>
              <div style={{ width: `${(100 - teamA.battingStrength) / 2}%` }} className="bg-slate-800 h-full"></div>
              <div style={{ width: `${(100 - teamB.battingStrength) / 2}%` }} className="bg-slate-800 h-full"></div>
              <div style={{ width: `${teamB.battingStrength / 2}%` }} className="bg-cricket-amber h-full rounded-r-full ml-auto"></div>
            </div>
          </div>

          {/* Bowling Strength */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-display tracking-wider font-bold">
              <span className="text-cricket-cyan">{teamA.bowlingStrength}%</span>
              <span className="text-slate-300 uppercase">BOWLING STRENGTH</span>
              <span className="text-cricket-amber">{teamB.bowlingStrength}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${teamA.bowlingStrength / 2}%` }} className="bg-cricket-cyan h-full rounded-l-full"></div>
              <div style={{ width: `${(100 - teamA.bowlingStrength) / 2}%` }} className="bg-slate-800 h-full"></div>
              <div style={{ width: `${(100 - teamB.bowlingStrength) / 2}%` }} className="bg-slate-800 h-full"></div>
              <div style={{ width: `${teamB.bowlingStrength / 2}%` }} className="bg-cricket-amber h-full rounded-r-full ml-auto"></div>
            </div>
          </div>

          {/* Fielding Strength */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-display tracking-wider font-bold">
              <span className="text-cricket-cyan">{teamA.fieldingStrength}%</span>
              <span className="text-slate-300 uppercase">FIELDING STRENGTH</span>
              <span className="text-cricket-amber">{teamB.fieldingStrength}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${teamA.fieldingStrength / 2}%` }} className="bg-cricket-cyan h-full rounded-l-full"></div>
              <div style={{ width: `${(100 - teamA.fieldingStrength) / 2}%` }} className="bg-slate-800 h-full"></div>
              <div style={{ width: `${(100 - teamB.fieldingStrength) / 2}%` }} className="bg-slate-800 h-full"></div>
              <div style={{ width: `${teamB.fieldingStrength / 2}%` }} className="bg-cricket-amber h-full rounded-r-full ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Recent Form */}
        <div className="border-t border-slate-800 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-cricket-amber" />
            <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
              Form Indicators (LATEST FIRST)
            </span>
          </div>
          
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-display">{teamA.shortName}:</span>
              <div className="flex gap-1">
                {teamA.recentForm.map((res, i) => renderFormBadge(res, i))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-display">{teamB.shortName}:</span>
              <div className="flex gap-1">
                {teamB.recentForm.map((res, i) => renderFormBadge(res, i))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
