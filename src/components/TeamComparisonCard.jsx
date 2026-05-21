import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Legend, Tooltip 
} from 'recharts';
import { getHeadToHead } from '../utils/cricketHelpers';
import { ShieldCheck, Flame, Compass, HelpCircle } from 'lucide-react';
import { useMatch } from '../context/MatchContext';

export default function TeamComparisonCard({ teamA: propTeamA, teamB: propTeamB }) {
  const { match } = useMatch();
  
  // Use props if provided, fallback to context state
  const teamA = propTeamA || match.teamA;
  const teamB = propTeamB || match.teamB;
  const format = match.format || 'T20';

  if (!teamA || !teamB) {
    return (
      <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border flex flex-col items-center justify-center text-center text-slate-400">
        <HelpCircle className="w-10 h-10 mx-auto text-slate-500 mb-2" />
        <span>Please configure opposing teams to view statistical analysis.</span>
      </div>
    );
  }

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

  const formRatingA = (teamA.recentForm.filter(r => r === 'W').length / teamA.recentForm.length) * 100;
  const formRatingB = (teamB.recentForm.filter(r => r === 'W').length / teamB.recentForm.length) * 100;

  const winPctA = format === 'T20' ? teamA.t20WinPct : format === 'ODI' ? teamA.odiWinPct : teamA.testWinPct;
  const winPctB = format === 'T20' ? teamB.t20WinPct : format === 'ODI' ? teamB.odiWinPct : teamB.testWinPct;

  // Radar Chart comparative stats using 5 requested axes
  const radarData = [
    {
      subject: 'Batting',
      [teamA.name]: teamA.battingStrength,
      [teamB.name]: teamB.battingStrength,
      fullMark: 100,
    },
    {
      subject: 'Bowling',
      [teamA.name]: teamA.bowlingStrength,
      [teamB.name]: teamB.bowlingStrength,
      fullMark: 100,
    },
    {
      subject: 'Fielding',
      [teamA.name]: teamA.fieldingStrength,
      [teamB.name]: teamB.fieldingStrength,
      fullMark: 100,
    },
    {
      subject: 'Form',
      [teamA.name]: formRatingA,
      [teamB.name]: formRatingB,
      fullMark: 100,
    },
    {
      subject: 'Win %',
      [teamA.name]: winPctA,
      [teamB.name]: winPctB,
      fullMark: 100,
    },
  ];

  return (
    <div className="bg-cricket-card rounded-2xl border border-cricket-border shadow-xl overflow-hidden page-enter">
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
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Left Side: Stat meters & indicators */}
        <div className="space-y-6">
          
          {/* Head-to-Head Statistics row */}
          <div className="bg-slate-900/50 rounded-xl border border-cricket-border p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Compass className="w-4 h-4 text-cricket-cyan" />
              <h5 className="text-xs font-bold tracking-wider uppercase font-display">Historical Head-to-Head</h5>
            </div>
            <div className="grid grid-cols-3 text-center border-t border-slate-850 pt-3">
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
          <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-cricket-amber" />
              <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                Form Indicators (LATEST FIRST)
              </span>
            </div>
            
            <div className="flex justify-between items-center gap-4 text-xs font-display">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{teamA.shortName}:</span>
                <div className="flex gap-1">
                  {teamA.recentForm.map((res, i) => renderFormBadge(res, i))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{teamB.shortName}:</span>
                <div className="flex gap-1">
                  {teamB.recentForm.map((res, i) => renderFormBadge(res, i))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Recharts Radar chart comparative mapping */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/30 border border-slate-850 h-80">
          <div className="text-center mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-display">Squad Metrics Radar</span>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 'bold' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name={teamA.name} dataKey={teamA.name}
                stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15}
                isAnimationActive={true} animationBegin={300} animationDuration={1000}
              />
              <Radar
                name={teamB.name} dataKey={teamB.name}
                stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.15}
                isAnimationActive={true} animationBegin={300} animationDuration={1000}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0f1e',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', fontFamily: 'Rajdhani', letterSpacing: '0.05em' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
