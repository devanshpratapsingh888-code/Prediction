import React, { useEffect } from 'react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import AIStrategyPanel from '../components/AIStrategyPanel';
import { HelpCircle, RefreshCw, AlertCircle, Info } from 'lucide-react';

export default function AIStrategy({ matchConfig, players, aiState }) {
  const { teamA, teamB, format, venue, pitchType, tossWinner, tossDecision } = matchConfig;
  const { loading, error, data, generateStrategy } = aiState;

  // Trigger generation automatically when the page loads, but only if we have a valid fixture configured
  useEffect(() => {
    if (teamA && teamB && venue && !data && !loading) {
      generateStrategy(teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, players);
    }
  }, [teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, players, data, loading, generateStrategy]);

  // Handle manual regenerate button clicks
  const handleRegenerate = () => {
    generateStrategy(teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, players);
  };

  // Guard: Fixture not yet set up
  if (!teamA || !teamB) {
    return (
      <div className="bg-cricket-card p-8 rounded-2xl border border-cricket-border text-center space-y-4 fade-in">
        <HelpCircle className="w-12 h-12 mx-auto text-slate-500" />
        <h3 className="text-xl font-bold font-display text-white">Fixture Not Configured</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Please navigate back to the Match Setup portal, select your fixture parameters, and launch the Strategy Engine to calculate tactical reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 fade-in">
      
      {/* Page Header */}
      <div className="no-print">
        <h2 className="text-2xl font-bold font-display text-white tracking-wide">
          AI TACTICAL DECISION ENGINE
        </h2>
        <p className="text-xs text-slate-400">
          Machine-generated game plan and tactical rotations built for {teamA.name} vs {teamB.name}
        </p>
      </div>

      {/* Local Simulation Fallback notification banner */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-cricket-amber/10 border border-cricket-amber/30 text-cricket-amber text-xs no-print">
          <Info className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <div>
            <span className="font-bold uppercase tracking-wider block">Local Engine Fallback</span>
            <span className="font-semibold text-slate-300">The AI model compiled this report using local statistical simulations. Configure your `GEMINI_API_KEY` for live generative insights.</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <LoadingSkeleton />
      ) : data ? (
        <AIStrategyPanel 
          data={data} 
          teamA={teamA} 
          teamB={teamB} 
          onRegenerate={handleRegenerate} 
        />
      ) : (
        <div className="bg-cricket-card p-8 rounded-2xl border border-cricket-border text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-cricket-red" />
          <h3 className="text-xl font-bold font-display text-white">Strategy Compilation Failed</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            An unknown error occurred while analyzing the team metrics. Please try running the compiler again.
          </p>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-6 py-3 mx-auto text-sm font-bold font-display uppercase tracking-widest rounded-xl bg-cricket-cyan text-cricket-dark hover:bg-opacity-95 font-bold transition shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Strategy Compilation
          </button>
        </div>
      )}

    </div>
  );
}
