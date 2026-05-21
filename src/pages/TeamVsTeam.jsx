import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import TeamComparisonCard from '../components/TeamComparisonCard';
import PhaseChart from '../components/PhaseChart';
import { getPhaseStats } from '../utils/cricketHelpers';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import { useMatch } from '../context/MatchContext';

export default function TeamVsTeam({ players, onNavigate }) {
  const { match } = useMatch();
  const { teamA, teamB, format } = match;

  // Graceful fallback if teams haven't been selected yet
  if (!teamA || !teamB) {
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

  // Calculate dynamic Form rating (0-100) based on W/L
  const getFormRating = (form) => {
    if (!form) return 50;
    const wins = form.filter(f => f === 'W').length;
    return Math.round((wins / form.length) * 100);
  };

  const formRatingA = getFormRating(teamA.recentForm);
  const formRatingB = getFormRating(teamB.recentForm);

  const winPctA = format === 'T20' ? teamA.t20WinPct : format === 'ODI' ? teamA.odiWinPct : teamA.testWinPct;
  const winPctB = format === 'T20' ? teamB.t20WinPct : format === 'ODI' ? teamB.odiWinPct : teamB.testWinPct;

  // Radar Chart comparative stats using the 5 requested axes
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

  // Win % by format data
  const winPctData = [
    { format: 'T20', [teamA.name]: teamA.t20WinPct, [teamB.name]: teamB.t20WinPct },
    { format: 'ODI', [teamA.name]: teamA.odiWinPct, [teamB.name]: teamB.odiWinPct },
    { format: 'Test', [teamA.name]: teamA.testWinPct, [teamB.name]: teamB.testWinPct }
  ];

  // Phase statistics
  const phaseDataA = getPhaseStats(teamA.id, players);
  const phaseDataB = getPhaseStats(teamB.id, players);

  // Dynamic tactical strengths & weaknesses lists
  const getTacticalProfile = (teamId) => {
    const profiles = {
      ind: {
        strengths: ["World-class spin manipulation in middle overs", "Lethal death bowling execution (Bumrah economy < 7)", "Consistent top-order partnership builders"],
        weaknesses: ["Vulnerability against sharp early left-arm fast swing", "Lower middle-order batting depth under extreme run rates"]
      },
      aus: {
        strengths: ["High-intensity powerplay bowling attack", "Brutal muscular finishing strike rates (Maxwell, Russell style)", "Outstanding boundary catching and athletic saves"],
        weaknesses: ["Susceptible to aggressive wrist-spin variations", "Can leak runs when pace-off lengths are forced"]
      },
      eng: {
        strengths: ["Ultra-aggressive batting strike rates from ball one", "Deep batting lineup extending down to over #9", "Good variations in left-arm/right-arm pace splits"],
        weaknesses: ["Risk of early wickets due to hyper-aggression", "Highly susceptible to dry spinning pitches"]
      },
      pak: {
        strengths: ["Hostile, high-velocity fast bowling reserves", "Solid and stable anchor batting partnerships", "Skilled bowling variations (cutters and reverse swing)"],
        weaknesses: ["Sub-par fielding conversions and boundary leaks", "Fragile middle-order scoring acceleration"]
      },
      sa: {
        strengths: ["Exceptional fielding efficiency and run-out rates", "Dynamic middle-order power hitters", "High-bounce fast bowling parameters"],
        weaknesses: ["Clutch anxiety under high knockout pressure", "Limited bowling containment options on flat grounds"]
      },
      nz: {
        strengths: ["Exceptional tactical adaptability and team discipline", "High-control swing bowlers in powerplays", "Clever defensive spinners operating in middle overs"],
        weaknesses: ["Lack of extreme express pace options", "Limited replacement depth for premium core batters"]
      },
      wi: {
        strengths: ["Massive boundary-hitting muscle power", "Lethal all-rounder balance (Holder, Russell style)", "Brutal counter-attacking speed against spin"],
        weaknesses: ["High dot-ball percentages between boundaries", "Vulnerable against high quality leg-spin slides"]
      },
      sl: {
        strengths: ["Elite mystery spin and googly specialists", "Excellent death-over bowling control (slingshot cutters)", "Agile running between wickets"],
        weaknesses: ["Inconsistent scoring velocity under hostile bouncers", "Vulnerable swing defense under green lighting"]
      }
    };
    return profiles[teamId] || {
      strengths: ["Solid balanced squad", "Skilled powerplay bowling options", "Competitive fielding drills"],
      weaknesses: ["Occasional lapses in death over containment", "Needs stable batting partnerships"]
    };
  };

  const profileA = getTacticalProfile(teamA.id);
  const profileB = getTacticalProfile(teamB.id);

  return (
    <div className="space-y-8 pb-12 page-enter">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white tracking-wide">
          SQUAD STATISTICAL COMPARISON
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Comparative overview contrasting performance indices, game phases, and historic win splits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Summary Card */}
        <TeamComparisonCard teamA={teamA} teamB={teamB} />

        {/* Right Column: Radar Chart comparison */}
        <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl flex flex-col justify-between hover:border-cricket-cyan/20 transition-all duration-300">
          <div className="flex flex-col gap-1 mb-4">
            <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">
              Squad Metrics Radar
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Contrasting team characteristics on a multi-axis capability scale
            </p>
          </div>

          <div className="w-full h-72 flex items-center justify-center page-enter">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Rajdhani', fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: '#475569', fontSize: 10 }}
                  stroke="transparent"
                />
                <Radar 
                  name={teamA.name} 
                  dataKey={teamA.name} 
                  stroke="#38bdf8" 
                  fill="#38bdf8" 
                  fillOpacity={0.15} 
                  isAnimationActive={true}
                  animationBegin={300}
                  animationDuration={1000}
                />
                <Radar 
                  name={teamB.name} 
                  dataKey={teamB.name} 
                  stroke="#fbbf24" 
                  fill="#fbbf24" 
                  fillOpacity={0.15} 
                  isAnimationActive={true}
                  animationBegin={300}
                  animationDuration={1000}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0a0f1e',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontFamily: 'Inter',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    fontFamily: 'Rajdhani',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Phase Comparison Chart & Format Win % Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase Chart */}
        <PhaseChart 
          teamA={teamA} 
          teamB={teamB} 
          phaseDataA={phaseDataA} 
          phaseDataB={phaseDataB} 
        />

        {/* Format Win % Horizontal Bar */}
        <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition-all duration-300">
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">
              Win Percentage by Match Format
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Historical match success rates across Test matches, ODIs, and international T20s
            </p>
          </div>

          <div className="w-full h-80 page-enter">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={winPctData}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  stroke="#1e293b"
                />
                <YAxis 
                  dataKey="format" 
                  type="category" 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Rajdhani', fontWeight: 'bold' }} 
                  stroke="#1e293b"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0a0f1e',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontFamily: 'Inter',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontFamily: 'Rajdhani',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                />
                <Bar 
                  dataKey={teamA.name} 
                  fill="#38bdf8" 
                  radius={[0, 4, 4, 0]} 
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
                <Bar 
                  dataKey={teamB.name} 
                  fill="#fbbf24" 
                  radius={[0, 4, 4, 0]} 
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Strengths vs Weaknesses columns */}
      <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition-all duration-300">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <ShieldCheck className="w-5 h-5 text-cricket-cyan" />
          <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">
            Squad Tactical Briefings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team A Profiling */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-base tracking-wider border-l-4 border-cricket-cyan pl-2">
              {teamA.name} Profiling
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-cricket-green font-bold uppercase tracking-wider font-display">Strategic Strengths</span>
                <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                  {profileA.strengths.map((str, i) => (
                    <li key={i} className="leading-relaxed">{str}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-cricket-red font-bold uppercase tracking-wider font-display">Tactical Vulnerabilities</span>
                <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                  {profileA.weaknesses.map((weak, i) => (
                    <li key={i} className="leading-relaxed">{weak}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Team B Profiling */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-base tracking-wider border-l-4 border-cricket-amber pl-2">
              {teamB.name} Profiling
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-cricket-green font-bold uppercase tracking-wider font-display">Strategic Strengths</span>
                <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                  {profileB.strengths.map((str, i) => (
                    <li key={i} className="leading-relaxed">{str}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-cricket-red font-bold uppercase tracking-wider font-display">Tactical Vulnerabilities</span>
                <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                  {profileB.weaknesses.map((weak, i) => (
                    <li key={i} className="leading-relaxed">{weak}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
