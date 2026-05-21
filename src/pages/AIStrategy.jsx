import React, { useEffect, useState } from 'react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import AIStrategyPanel from '../components/AIStrategyPanel';
import { useMatch } from '../context/MatchContext';
import { HelpCircle, RefreshCw, AlertCircle, Copy, Check, FileText } from 'lucide-react';

export default function AIStrategy({ teams, venues, players, aiState, onNavigate }) {
  const { match } = useMatch();
  const { teamA, teamB, format, venue, pitchType, tossWinner, tossDecision } = match;
  const { loading, error, data, generate } = aiState;

  const [copied, setCopied] = useState(false);

  // Trigger strategy compilation automatically on load if we have a valid fixture and no data yet
  useEffect(() => {
    if (teamA && teamB && venue && !data && !loading) {
      generate(match, teams, venues);
    }
  }, [teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, teams, venues, data, loading, generate, match]);

  const handleRegenerate = () => {
    generate(match, teams, venues);
  };

  const handleCopy = () => {
    if (!data) return;
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Guard Empty State: No match configured
  if (!match.teamA || !match.teamB) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
      }} className="page-enter">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏏</div>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, color: '#38bdf8', marginBottom: 8 }} className="font-display font-bold">
          No match configured
        </h2>
        <p style={{ color: '#64748b', marginBottom: 24 }} className="text-sm font-medium">
          Go back to Home and select two teams to get started
        </p>
        <button 
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 rounded-xl font-bold font-display uppercase tracking-widest bg-cricket-cyan text-cricket-dark hover:bg-[#5cd5ff] transition duration-200 shadow-lg"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 page-enter">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cricket-border pb-4 no-print">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide uppercase">
            AI TACTICAL DECISION ENGINE
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Machine-generated tactical strategy and players blueprints built for {teamA?.name} vs {teamB?.name}
          </p>
        </div>

        {/* Generative & Utility Controls */}
        {data && !loading && (
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-widest transition duration-200 border border-slate-700 ${
                copied 
                  ? 'bg-cricket-green/20 text-cricket-green border-cricket-green/30' 
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : '📋 Copy Strategy'}
            </button>

            <button
              onClick={handleRegenerate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-widest bg-cricket-cyan text-cricket-dark hover:bg-[#5cd5ff] transition duration-200 shadow-md"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              🔄 Regenerate Strategy
            </button>
          </div>
        )}
      </div>

      {/* API Error Notification Card */}
      {error && !loading && (
        <div style={{
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.3)',
          borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 24,
        }} className="no-print">
          <p style={{ color: '#f87171', marginBottom: 12 }} className="text-sm font-semibold">⚠ {error}</p>
          <button
            onClick={handleRegenerate}
            style={{
              background: '#38bdf8', color: '#0a0f1e',
              border: 'none', borderRadius: 8, padding: '8px 20px',
              cursor: 'pointer', fontWeight: 600,
            }}
            className="font-display uppercase tracking-widest text-xs shadow-md"
          >
            Retry
          </button>
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
            className="flex items-center gap-2 px-6 py-3 mx-auto text-sm font-bold font-display uppercase tracking-widest rounded-xl bg-cricket-cyan text-cricket-dark hover:bg-opacity-95 transition shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Strategy Compilation
          </button>
        </div>
      )}

    </div>
  );
}
