import React from 'react';
import { 
  Trophy, BookOpen, Swords, Target, Layout, ShieldAlert, 
  TrendingUp, Users, RefreshCw, Printer, AlertTriangle 
} from 'lucide-react';
import WinProbabilityGauge from './WinProbabilityGauge';

export default function AIStrategyPanel({ data, teamA, teamB, onRegenerate }) {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 fade-in">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cricket-border pb-4 no-print">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide">
            Tactical Analysis Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            Advanced intelligence reports compiled by Google Gemini AI
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold font-display uppercase tracking-wider rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Strategy
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold font-display uppercase tracking-wider rounded-xl bg-cricket-cyan text-cricket-dark hover:bg-opacity-90 font-bold transition shadow-[0_4px_15px_rgba(56,189,248,0.2)]"
          >
            <Printer className="w-4 h-4" />
            Copy to PDF
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2/3 Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Match Overview */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition print-card">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <BookOpen className="w-5 h-5 text-cricket-cyan" />
              <h3 className="text-base font-bold font-display text-white uppercase tracking-wider print-text">
                Match Intelligence Briefing
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed print-text">
              {data.matchOverview}
            </p>
          </div>

          {/* Card 2: Batting Strategy */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition print-card">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <Swords className="w-5 h-5 text-cricket-cyan" />
              <h3 className="text-base font-bold font-display text-white uppercase tracking-wider print-text">
                Batting Blueprint ({teamA.name})
              </h3>
            </div>
            <ul className="space-y-3">
              {data.battingStrategy.map((point, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-300 print-text">
                  <span className="w-5 h-5 rounded-full bg-cricket-cyan/15 text-cricket-cyan flex items-center justify-center text-xs font-bold font-display flex-shrink-0 mt-0.5 no-print">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Bowling Plan */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition print-card">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <Target className="w-5 h-5 text-cricket-cyan" />
              <h3 className="text-base font-bold font-display text-white uppercase tracking-wider print-text">
                Defensive Bowling Plans
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-cricket-cyan font-bold uppercase tracking-widest font-display">Powerplay (Overs 1-6)</span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed print-text">{data.bowlingPlan.powerplay}</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-cricket-cyan font-bold uppercase tracking-widest font-display">Middle (Overs 7-15)</span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed print-text">{data.bowlingPlan.middleOvers}</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-cricket-cyan font-bold uppercase tracking-widest font-display">Death (Overs 16-20)</span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed print-text">{data.bowlingPlan.deathOvers}</p>
                </div>
              </div>

              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Suggested Strike Bowlers:</span>
                {data.bowlingPlan.keyBowlers.map((bowler, i) => (
                  <span key={i} className="text-xs font-bold font-display uppercase bg-cricket-cyan/15 text-cricket-cyan px-3 py-1 rounded border border-cricket-cyan/20">
                    🥎 {bowler}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Field Setup & Bowling Rotation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Field Setup */}
            <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition print-card">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
                <Layout className="w-5 h-5 text-cricket-cyan" />
                <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider print-text">
                  Key Field Placements
                </h3>
              </div>
              <ul className="space-y-3">
                {data.fieldSetup.map((setup, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-300 leading-relaxed print-text">
                    <span className="text-cricket-cyan font-bold select-none">•</span>
                    <span>{setup}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bowling Rotation */}
            <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition print-card">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
                <RefreshCw className="w-5 h-5 text-cricket-cyan animate-spin-slow" />
                <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider print-text">
                  Over-by-Over Rotation
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed print-text">
                {data.bowlingRotation}
              </p>
            </div>

          </div>

        </div>

        {/* Right 1/3 Content */}
        <div className="space-y-6">
          
          {/* Win Probability Donut */}
          <WinProbabilityGauge 
            teamA={teamA} 
            teamB={teamB} 
            probability={data.winProbability} 
            confidence={data.winProbability.confidence} 
          />

          {/* Card 5: Optimal Playing XI */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition print-card">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <Users className="w-5 h-5 text-cricket-cyan" />
              <h3 className="text-base font-bold font-display text-white uppercase tracking-wider print-text">
                Suggested Playing XI
              </h3>
            </div>
            
            <div className="space-y-2">
              {data.optimalXI.map((player, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-800/40 text-xs font-semibold text-slate-300 font-display tracking-wide print-text">
                  <div className="flex gap-2 items-center">
                    <span className="text-slate-500 w-4 font-mono text-[10px]">{idx + 1}.</span>
                    <span className="uppercase">{player.split('(')[0].trim()}</span>
                  </div>
                  {player.includes('(') && (
                    <span className="text-[10px] font-bold text-cricket-cyan/85 bg-cricket-cyan/5 px-2 py-0.5 rounded border border-cricket-cyan/15 truncate max-w-[100px] uppercase font-display">
                      {player.split('(')[1].replace(')', '')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Risk Players */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition print-card">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <ShieldAlert className="w-5 h-5 text-cricket-amber" />
              <h3 className="text-base font-bold font-display text-white uppercase tracking-wider print-text">
                Key Opposition Threats
              </h3>
            </div>
            
            <div className="space-y-4">
              {data.riskPlayers.map((player, i) => (
                <div key={i} className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold font-display text-white uppercase tracking-wider">{player.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-display border ${
                      player.threatLevel?.toLowerCase() === 'critical'
                        ? 'bg-cricket-red/10 text-cricket-red border-cricket-red/20'
                        : 'bg-cricket-amber/10 text-cricket-amber border-cricket-amber/20'
                    }`}>
                      {player.threatLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed print-text">{player.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 7: Predicted Key Moments */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition print-card">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <TrendingUp className="w-5 h-5 text-cricket-cyan" />
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider print-text">
                Predicted Key Moments
              </h3>
            </div>
            <ul className="space-y-3">
              {data.keyMoments.map((moment, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-300 leading-relaxed print-text">
                  <span className="text-cricket-amber font-bold font-display select-none">⚡</span>
                  <span>{moment}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
