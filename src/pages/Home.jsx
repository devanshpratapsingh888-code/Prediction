import React from 'react';
import { useMatch } from '../context/MatchContext';
import { Shield, Sparkles, TrendingUp, ShieldAlert, Compass, Play } from 'lucide-react';

export default function Home({ teams, venues, onNavigate }) {
  const { match, updateMatch } = useMatch();
  
  const highlights = [
    {
      title: "Team Analytics Compare",
      desc: "Contrast batting, bowling, and fielding indices across 8 international squads. Explore phase-wise scoring averages.",
      icon: Shield,
      color: "text-cricket-cyan bg-cricket-cyan/10 border-cricket-cyan/20"
    },
    {
      title: "AI Strategy Generator",
      desc: "Uncover optimal playing XIs, dynamic batting blueprints, over-by-over bowling rotations, and key opposition target lists using Google Gemini.",
      icon: Sparkles,
      color: "text-cricket-amber bg-cricket-amber/10 border-cricket-amber/20"
    },
    {
      title: "Matchup Simulations",
      desc: "Test custom batter vs bowler pairings. Leverage our statistical simulator to predict boundary, dot, and strike ratios.",
      icon: TrendingUp,
      color: "text-cricket-green bg-cricket-green/10 border-cricket-green/20"
    }
  ];

  // Set default team values if they are null
  React.useEffect(() => {
    if (teams.length >= 2) {
      if (!match.teamA) {
        updateMatch({ teamA: teams[0] });
      }
      if (!match.teamB) {
        updateMatch({ teamB: teams[1] });
      }
    }
    if (venues.length > 0 && !match.venue) {
      updateMatch({ venue: venues[0] });
    }
  }, [teams, venues, match, updateMatch]);

  const teamAId = match.teamA?.id || '';
  const teamBId = match.teamB?.id || '';
  const format = match.format || 'T20';
  const venueId = match.venue?.id || '';
  const pitchType = match.pitchType || 'Flat';
  const tossWinner = match.tossWinner || '';
  const tossDecision = match.tossDecision || 'bat';

  const isSameTeam = teamAId && teamBId && teamAId === teamBId;
  const isInvalid = !match.teamA || !match.teamB || isSameTeam;

  const handleTeamAChange = (e) => {
    const selected = teams.find(t => t.id === e.target.value);
    updateMatch({ teamA: selected });
  };

  const handleTeamBChange = (e) => {
    const selected = teams.find(t => t.id === e.target.value);
    updateMatch({ teamB: selected });
  };

  const handleVenueChange = (e) => {
    const selected = venues.find(v => v.id === e.target.value);
    updateMatch({ venue: selected });
  };

  const selectedTeamAObj = match.teamA;
  const selectedTeamBObj = match.teamB;

  return (
    <div className="space-y-12 pb-12 page-enter">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a0f1e] to-slate-900 border border-cricket-border p-8 md:p-12 shadow-2xl flex flex-col justify-center items-center text-center">
        {/* Glowing visual indicators */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-cricket-cyan/5 rounded-full filter blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cricket-amber/5 rounded-full filter blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold font-display uppercase tracking-widest bg-cricket-cyan/10 text-cricket-cyan border border-cricket-cyan/30">
            🏏 Advanced Analytics Portal
          </span>
          
          <h1 className="text-4xl md:text-6xl font-extrabold font-display text-white tracking-wider leading-none">
            CRICKET STRATEGY ENGINE
          </h1>
          
          <p className="text-slate-400 text-sm md:text-lg tracking-wide max-w-2xl mx-auto font-medium">
            Tactical Intelligence for the Modern Game. Setup your fixture to unlock predictive matchups, phase stats, and generative team blueprints.
          </p>
        </div>
      </div>

      {/* Main Fixture Setup Form */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-cricket-border pb-4">
            <h2 className="text-2xl font-bold font-display text-white tracking-wide">
              Match Configuration
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cricket-cyan/15 text-cricket-cyan border border-cricket-cyan/30 uppercase tracking-widest font-display">
              Strategy Builder
            </span>
          </div>

          {/* Validation Warnings */}
          {isSameTeam && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cricket-red/10 border border-cricket-red/30 text-cricket-red text-sm transition-all duration-300">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold">⚠ Team B cannot be the same as Team A</span>
            </div>
          )}

          {/* Team Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
                Team A (Host / Primary)
              </label>
              <select
                value={teamAId}
                onChange={handleTeamAChange}
                className="w-full bg-cricket-card text-white rounded-xl border border-cricket-border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition uppercase font-display font-semibold tracking-wider"
              >
                <option value="">Select Team A</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.flag} {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
                Team B (Opponent)
              </label>
              <select
                value={teamBId}
                onChange={handleTeamBChange}
                className={`w-full bg-cricket-card text-white rounded-xl border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition uppercase font-display font-semibold tracking-wider ${
                  isSameTeam ? 'border-cricket-red !border-red-500' : 'border-cricket-border'
                }`}
              >
                <option value="">Select Team B</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.flag} {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
              Match Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['T20', 'ODI', 'Test'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => updateMatch({ format: f })}
                  className={`py-3 rounded-xl border text-sm font-bold font-display uppercase tracking-widest transition-all duration-300 ${
                    format === f
                      ? 'bg-cricket-cyan/15 border-cricket-cyan text-cricket-cyan shadow-[0_0_15px_rgba(56,189,248,0.05)]'
                      : 'bg-cricket-dark/60 border-cricket-border text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Venue & Pitch Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
                Match Venue
              </label>
              <select
                value={venueId}
                onChange={handleVenueChange}
                className="w-full bg-cricket-card text-white rounded-xl border border-cricket-border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition font-display font-semibold"
              >
                <option value="">Select Venue</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    🏟️ {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
                Pitch Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Flat', 'Seaming', 'Turning', 'Slow & Low'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updateMatch({ pitchType: p })}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold font-display uppercase tracking-wider transition-all duration-200 ${
                      pitchType === p
                        ? 'bg-cricket-cyan/15 border-cricket-cyan text-cricket-cyan font-bold'
                        : 'bg-cricket-dark/60 border-cricket-border text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toss Intelligence */}
          <div className="border-t border-cricket-border pt-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Compass className="w-5 h-5 text-cricket-cyan" />
              <h3 className="text-sm font-semibold uppercase tracking-wider font-display">Toss Intelligence (Optional)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 font-display font-semibold mb-2">
                  Toss Winner
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => updateMatch({ tossWinner: null })}
                    className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all ${
                      !tossWinner
                        ? 'bg-slate-700 border-slate-500 text-white'
                        : 'bg-cricket-dark/60 border-cricket-border text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Undecided
                  </button>
                  <button
                    type="button"
                    disabled={!selectedTeamAObj}
                    onClick={() => updateMatch({ tossWinner: selectedTeamAObj.id })}
                    className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all truncate ${
                      tossWinner === selectedTeamAObj?.id
                        ? 'bg-cricket-cyan/15 border-cricket-cyan text-cricket-cyan font-bold'
                        : 'bg-cricket-dark/60 border-cricket-border text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {selectedTeamAObj?.shortName || 'Team A'}
                  </button>
                  <button
                    type="button"
                    disabled={!selectedTeamBObj}
                    onClick={() => updateMatch({ tossWinner: selectedTeamBObj.id })}
                    className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all truncate ${
                      tossWinner === selectedTeamBObj?.id
                        ? 'bg-cricket-cyan/15 border-cricket-cyan text-cricket-cyan font-bold'
                        : 'bg-cricket-dark/60 border-cricket-border text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {selectedTeamBObj?.shortName || 'Team B'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 font-display font-semibold mb-2">
                  Decision
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!tossWinner}
                    onClick={() => updateMatch({ tossDecision: 'bat' })}
                    className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all ${
                      !tossWinner 
                        ? 'opacity-40 cursor-not-allowed border-cricket-border text-slate-650' 
                        : tossDecision === 'bat'
                        ? 'bg-cricket-amber/15 border-cricket-amber text-cricket-amber font-bold'
                        : 'bg-cricket-dark/60 border-cricket-border text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    🏏 Bat First
                  </button>
                  <button
                    type="button"
                    disabled={!tossWinner}
                    onClick={() => updateMatch({ tossDecision: 'bowl' })}
                    className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all ${
                      !tossWinner 
                        ? 'opacity-40 cursor-not-allowed border-cricket-border text-slate-655'
                        : tossDecision === 'bowl'
                        ? 'bg-cricket-amber/15 border-cricket-amber text-cricket-amber font-bold'
                        : 'bg-cricket-dark/60 border-cricket-border text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    🥎 Bowl First
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            disabled={isInvalid}
            onClick={() => onNavigate('/strategy')}
            style={{
              opacity: isInvalid ? 0.4 : 1,
              cursor: isInvalid ? 'not-allowed' : 'pointer',
            }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold font-display uppercase tracking-widest text-base text-cricket-dark bg-cricket-cyan hover:bg-[#5cd5ff] disabled:bg-slate-800 disabled:text-slate-500 disabled:border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(56,189,248,0.2)]"
          >
            <Play className="w-5 h-5 fill-current" />
            Generate Tactical Strategy
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-slate-800 transition-all duration-300 flex flex-col gap-4"
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold font-display text-white tracking-wide uppercase">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
