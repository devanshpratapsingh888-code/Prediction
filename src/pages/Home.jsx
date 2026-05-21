import React from 'react';
import MatchSetupForm from '../components/MatchSetupForm';
import { Shield, Sparkles, TrendingUp } from 'lucide-react';

export default function Home({ teams, venues, matchConfig, setMatchConfig, onGenerate }) {
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

  return (
    <div className="space-y-12 pb-12 fade-in">
      
      {/* Full-Screen Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-cricket-dark to-slate-900 border border-cricket-border p-8 md:p-12 shadow-2xl flex flex-col justify-center items-center text-center">
        {/* Decorative lights */}
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

      {/* Main Form Section */}
      <div className="max-w-4xl mx-auto">
        <MatchSetupForm 
          teams={teams} 
          venues={venues} 
          matchConfig={matchConfig} 
          setMatchConfig={setMatchConfig} 
          onGenerate={onGenerate} 
        />
      </div>

      {/* Highlight Cards */}
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
