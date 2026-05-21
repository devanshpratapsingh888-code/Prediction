import React, { useState, useEffect } from 'react';
import PlayerMatchupCard from '../components/PlayerMatchupCard';
import { getThreatColor } from '../utils/cricketHelpers';
import { Cpu, HelpCircle, Swords, ShieldAlert } from 'lucide-react';
import { useMatch } from '../context/MatchContext';

export default function PlayerMatchups({ players, aiState, onNavigate }) {
  const { match } = useMatch();
  const { teamA, teamB } = match;
  const { matchupInsight, matchupLoading, generateMatchupInsight } = aiState;

  // Search filter and selectors state
  const [search, setSearch] = useState('');
  const [selectedBatterId, setSelectedBatterId] = useState('');
  const [selectedBowlerId, setSelectedBowlerId] = useState('');

  // Collect batters and bowlers from players list
  const allBatters = players.filter(p => p.role.includes('Batter') || p.role.includes('keeper') || p.role.includes('All-Rounder'));
  const allBowlers = players.filter(p => p.role.includes('Bowler') || p.role.includes('All-Rounder'));

  // Filter batters by search text
  const filteredBatters = allBatters.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Prepopulate default selections on load
  useEffect(() => {
    if (players.length > 0) {
      const kohli = players.find(p => p.id === 'kohli');
      const starc = players.find(p => p.id === 'starc');
      
      if (kohli) {
        setSelectedBatterId(kohli.id);
      } else {
        setSelectedBatterId(allBatters[0]?.id || '');
      }

      if (starc) {
        setSelectedBowlerId(starc.id);
      } else {
        setSelectedBowlerId(allBowlers[0]?.id || '');
      }
    }
  }, [players]);

  const activeBatter = players.find(p => p.id === selectedBatterId);
  const activeBowler = players.find(p => p.id === selectedBowlerId);

  // Auto trigger AI duels compiling when selections change
  useEffect(() => {
    if (activeBatter && activeBowler) {
      generateMatchupInsight(activeBatter, activeBowler);
    }
  }, [selectedBatterId, selectedBowlerId, generateMatchupInsight]);

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

  // Dynamic discovery of threat matchups between teams
  const getDynamicThreatMatchups = () => {
    const squadAPlayers = players.filter(p => p.teamId === teamA.id);
    const squadBPlayers = players.filter(p => p.teamId === teamB.id);

    const threats = [];

    // Loop through team A batters and team B bowlers
    for (const b of squadAPlayers) {
      if (!b.role.includes('Batter') && !b.role.includes('keeper')) continue;
      for (const w of b.weaknesses) {
        const matchingBowler = squadBPlayers.find(bowler => {
          if (!bowler.role.includes('Bowler') && !bowler.role.includes('All')) return false;
          const bt = bowler.bowlingType?.toLowerCase() || '';
          const wl = w.toLowerCase();
          return (wl.includes('left-arm') && bt.includes('left-arm')) ||
                 (wl.includes('spin') && bt.includes('spin')) ||
                 (wl.includes('swing') && bt.includes('fast')) ||
                 (wl.includes('short') && bt.includes('fast'));
        });

        if (matchingBowler) {
          threats.push({
            batterName: b.name,
            bowlerName: matchingBowler.name,
            reason: `${matchingBowler.name} represents a dangerous threat by exploiting ${b.name}'s weakness to ${w}.`,
            level: b.formRating > 90 && matchingBowler.formRating > 90 ? "Critical" : "High"
          });
          break;
        }
      }
      if (threats.length >= 2) break;
    }

    // Loop through team B batters and team A bowlers
    for (const b of squadBPlayers) {
      if (!b.role.includes('Batter') && !b.role.includes('keeper')) continue;
      for (const w of b.weaknesses) {
        const matchingBowler = squadAPlayers.find(bowler => {
          if (!bowler.role.includes('Bowler') && !bowler.role.includes('All')) return false;
          const bt = bowler.bowlingType?.toLowerCase() || '';
          const wl = w.toLowerCase();
          return (wl.includes('left-arm') && bt.includes('left-arm')) ||
                 (wl.includes('spin') && bt.includes('spin')) ||
                 (wl.includes('swing') && bt.includes('fast')) ||
                 (wl.includes('short') && bt.includes('fast'));
        });

        if (matchingBowler) {
          threats.push({
            batterName: b.name,
            bowlerName: matchingBowler.name,
            reason: `${matchingBowler.name} targets ${b.name}'s susceptibility to ${w} with ${matchingBowler.strengths[0]}.`,
            level: "High"
          });
          break;
        }
      }
      if (threats.length >= 3) break;
    }

    // fallback fills if fewer threats mapped
    while (threats.length < 3) {
      const fallbackBat = squadAPlayers[0] || allBatters[0];
      const fallbackBowl = squadBPlayers[1] || allBowlers[1];
      threats.push({
        batterName: fallbackBat?.name || "Primary Batter",
        bowlerName: fallbackBowl?.name || "Primary Bowler",
        reason: `${fallbackBowl?.name} challenges the batter's early timing parameters in powerplays.`,
        level: "Medium"
      });
    }

    return threats.slice(0, 3);
  };

  const dangerousMatchups = getDynamicThreatMatchups();

  return (
    <div className="space-y-8 pb-12 page-enter">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white tracking-wide uppercase">
          Interactive Matchup Simulator
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Contrast specific Batter vs Bowler metrics and compile tactical AI analytical insights
        </p>
      </div>

      {/* Selectors Form Container */}
      <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batter Select column with player search */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
            Select Batter
          </label>
          {/* Batter Search input */}
          <input
            type="text"
            placeholder="🔍 Search batters..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-cricket-dark text-white rounded-xl border border-cricket-border px-4 py-2.5 mb-2 focus:outline-none focus:border-cricket-cyan text-sm"
          />
          <select
            value={selectedBatterId}
            onChange={(e) => setSelectedBatterId(e.target.value)}
            className="w-full bg-cricket-dark text-white rounded-xl border border-cricket-border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition font-display font-semibold"
          >
            {/* If currently selected is not in filtered list, display it at top so select stays valid */}
            {activeBatter && !filteredBatters.some(p => p.id === activeBatter.id) && (
              <option value={activeBatter.id}>
                🏏 {activeBatter.name} (Active Selection)
              </option>
            )}
            {filteredBatters.map((p) => {
              const team = teamA?.id === p.teamId ? teamA : teamB?.id === p.teamId ? teamB : null;
              const teamLabel = team ? ` [${team.shortName}]` : '';
              return (
                <option key={p.id} value={p.id}>
                  🏏 {p.name}{teamLabel}
                </option>
              );
            })}
            {filteredBatters.length === 0 && (
              <option value="">No batters match search</option>
            )}
          </select>
        </div>

        {/* Bowler Select column */}
        <div className="flex flex-col justify-end">
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-display font-bold mb-2">
            Select Bowler
          </label>
          <select
            value={selectedBowlerId}
            onChange={(e) => setSelectedBowlerId(e.target.value)}
            className="w-full bg-cricket-dark text-white rounded-xl border border-cricket-border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition font-display font-semibold"
          >
            {allBowlers.map((p) => {
              const team = teamA?.id === p.teamId ? teamA : teamB?.id === p.teamId ? teamB : null;
              const teamLabel = team ? ` [${team.shortName}]` : '';
              return (
                <option key={p.id} value={p.id}>
                  🥎 {p.name}{teamLabel}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Duel Visualizations & Insights Grid */}
      {activeBatter && activeBowler ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Left Visualizer */}
          <div className="lg:col-span-2">
            <PlayerMatchupCard batter={activeBatter} bowler={activeBowler} />
          </div>

          {/* Right AI insight panels */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl flex flex-col justify-between hover:border-cricket-cyan/20 transition-all duration-300">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <Cpu className="w-5 h-5 text-cricket-cyan animate-pulse" />
              <h3 className="text-base font-bold font-display text-white uppercase tracking-wider">
                AI Matchup Tactics
              </h3>
            </div>

            {matchupLoading ? (
              <div className="py-12 flex flex-col items-center justify-center flex-1 space-y-3 text-center">
                <div className="w-10 h-10 rounded-full border-4 border-t-cricket-cyan border-slate-850 animate-spin"></div>
                <span className="text-xs text-slate-400 font-display font-bold uppercase tracking-wider animate-pulse">Running Duel Analytics...</span>
              </div>
            ) : matchupInsight ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{matchupInsight}"
                </p>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-[10px] text-slate-500 font-medium font-sans mt-auto leading-relaxed">
                  💡 Coaches Tip: Target {activeBatter.name}'s front foot stance with full-swing yorkers on off stump during the early overs.
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                Waiting for simulator...
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-cricket-card p-8 rounded-2xl border border-cricket-border text-center text-slate-400">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-500 mb-2" />
          Please select valid players to initiate the duel simulation.
        </div>
      )}

      {/* Recommended Tactical Pairings */}
      <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/10 transition">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <Swords className="w-5 h-5 text-cricket-amber" />
          <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">
            Critical Tactical Targets
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dangerousMatchups.map((item, i) => (
            <div 
              key={i} 
              className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 hover:border-slate-800 transition"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-display block">Matchup #{i+1}</span>
                  <span className="text-sm font-bold font-display text-white uppercase tracking-wider leading-none block mt-1">{item.batterName} vs {item.bowlerName}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase border font-display ${getThreatColor(item.level)}`}>
                  {item.level}
                </span>
              </div>
              
              <p className="text-xs text-slate-450 leading-relaxed font-sans min-h-[50px]">
                {item.reason}
              </p>

              <button
                onClick={() => {
                  const bat = players.find(p => p.name === item.batterName);
                  const bowl = players.find(p => p.name === item.bowlerName);
                  if (bat) setSelectedBatterId(bat.id);
                  if (bowl) setSelectedBowlerId(bowl.id);
                }}
                className="w-full text-center py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-[10px] font-bold font-display uppercase tracking-widest text-slate-300 border border-slate-700 hover:text-white transition"
              >
                Simulate Matchup Duel
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
