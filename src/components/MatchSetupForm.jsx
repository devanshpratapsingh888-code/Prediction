import React, { useState, useEffect } from 'react';
import { ShieldAlert, Award, Compass, Play } from 'lucide-react';

export default function MatchSetupForm({ teams, venues, matchConfig, setMatchConfig, onGenerate }) {
  const [teamA, setTeamA] = useState(matchConfig.teamA?.id || '');
  const [teamB, setTeamB] = useState(matchConfig.teamB?.id || '');
  const [format, setFormat] = useState(matchConfig.format || 'T20');
  const [venue, setVenue] = useState(matchConfig.venue?.id || '');
  const [pitchType, setPitchType] = useState(matchConfig.pitchType || 'Flat');
  const [tossWinner, setTossWinner] = useState(matchConfig.tossWinner || '');
  const [tossDecision, setTossDecision] = useState(matchConfig.tossDecision || 'bat');
  const [error, setError] = useState('');

  // Handle auto-populating choices when datasets load
  useEffect(() => {
    if (teams.length >= 2) {
      if (!teamA) setTeamA(teams[0].id);
      if (!teamB) setTeamB(teams[1].id);
    }
    if (venues.length > 0 && !venue) {
      setVenue(venues[0].id);
    }
  }, [teams, venues]);

  // Sync state back to parent config
  useEffect(() => {
    const selectedTeamA = teams.find(t => t.id === teamA);
    const selectedTeamB = teams.find(t => t.id === teamB);
    const selectedVenue = venues.find(v => v.id === venue);

    if (teamA === teamB && teamA !== '') {
      setError("Strategic Warning: Opposing teams cannot be the same.");
    } else {
      setError('');
    }

    setMatchConfig({
      teamA: selectedTeamA,
      teamB: selectedTeamB,
      format,
      venue: selectedVenue,
      pitchType,
      tossWinner: tossWinner === 'teamA' ? selectedTeamA?.id : tossWinner === 'teamB' ? selectedTeamB?.id : '',
      tossDecision
    });
  }, [teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, teams, venues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamA === teamB) {
      setError("Please select different opposing teams.");
      return;
    }
    onGenerate();
  };

  const selectedTeamAObj = teams.find(t => t.id === teamA);
  const selectedTeamBObj = teams.find(t => t.id === teamB);

  return (
    <form onSubmit={handleSubmit} className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl space-y-6 fade-in">
      <div className="flex items-center justify-between border-b border-cricket-border pb-4">
        <h2 className="text-2xl font-bold font-display text-white tracking-wide">
          Match Configuration
        </h2>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cricket-cyan/15 text-cricket-cyan border border-cricket-cyan/30 uppercase tracking-widest font-display">
          Strategy Builder
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-cricket-red/10 border border-cricket-red/30 text-cricket-red text-sm transition-all duration-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Team Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
            Team A (Host / Primary)
          </label>
          <select
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="w-full bg-cricket-dark text-white rounded-xl border border-cricket-border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition duration-200 uppercase font-display font-semibold tracking-wider"
          >
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
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="w-full bg-cricket-dark text-white rounded-xl border border-cricket-border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition duration-200 uppercase font-display font-semibold tracking-wider"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.flag} {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
          Match Format
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['T20', 'ODI', 'Test'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
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
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full bg-cricket-dark text-white rounded-xl border border-cricket-border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition duration-200 font-display font-semibold"
          >
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
                onClick={() => setPitchType(p)}
                className={`py-2 px-1 rounded-lg border text-xs font-bold font-display uppercase tracking-wider transition-all duration-200 ${
                  pitchType === p
                    ? 'bg-cricket-cyan/15 border-cricket-cyan text-cricket-cyan'
                    : 'bg-cricket-dark/60 border-cricket-border text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toss Configuration (Optional) */}
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
                onClick={() => setTossWinner('')}
                className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all ${
                  tossWinner === ''
                    ? 'bg-slate-700 border-slate-500 text-white'
                    : 'bg-cricket-dark/60 border-cricket-border text-slate-500 hover:text-slate-300'
                }`}
              >
                Undecided
              </button>
              <button
                type="button"
                disabled={!selectedTeamAObj}
                onClick={() => setTossWinner('teamA')}
                className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all truncate ${
                  tossWinner === 'teamA'
                    ? 'bg-cricket-cyan/15 border-cricket-cyan text-cricket-cyan font-bold'
                    : 'bg-cricket-dark/60 border-cricket-border text-slate-400 hover:text-slate-300'
                }`}
              >
                {selectedTeamAObj?.shortName || 'Team A'}
              </button>
              <button
                type="button"
                disabled={!selectedTeamBObj}
                onClick={() => setTossWinner('teamB')}
                className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all truncate ${
                  tossWinner === 'teamB'
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
                onClick={() => setTossDecision('bat')}
                className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all ${
                  !tossWinner 
                    ? 'opacity-40 cursor-not-allowed border-cricket-border text-slate-600' 
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
                onClick={() => setTossDecision('bowl')}
                className={`py-2 text-xs rounded-lg border font-display uppercase font-semibold transition-all ${
                  !tossWinner 
                    ? 'opacity-40 cursor-not-allowed border-cricket-border text-slate-600'
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={teamA === teamB || !teamA || !teamB}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold font-display uppercase tracking-widest text-base text-cricket-dark bg-cricket-cyan hover:bg-[#5cd5ff] disabled:bg-slate-800 disabled:text-slate-500 disabled:border-transparent disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(56,189,248,0.2)] hover:shadow-[0_4px_25px_rgba(56,189,248,0.3)] transition-all duration-300 transform active:scale-[0.99]"
      >
        <Play className="w-5 h-5 fill-current" />
        Generate Tactical Strategy
      </button>
    </form>
  );
}
