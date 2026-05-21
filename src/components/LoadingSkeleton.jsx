import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';

const LOADING_MESSAGES = [
  "Analyzing pitch conditions & moisture levels...",
  "Studying player historical matchup matrices...",
  "Calculating dynamic win probability ratios...",
  "Formulating optimal bowling rotation schemes...",
  "Synthesizing field placement arrangements...",
  "Structuring optimal playing XI combinations...",
  "Finalizing comprehensive tactical game plan..."
];

export default function LoadingSkeleton() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-skeleton-pulse fade-in">
      {/* Loading Status Indicator */}
      <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-cricket-cyan/10 border border-cricket-cyan/30 flex items-center justify-center text-cricket-cyan animate-spin duration-3000">
          <Cpu className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-display text-white tracking-widest uppercase">
            COMPILING AI TACTICS
          </h3>
          <p className="text-cricket-cyan font-mono text-sm tracking-wide h-6 transition-all duration-300">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>
      </div>

      {/* Skeletons mimicking the AI Strategy Panel layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Match Overview & Win Prob */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Overview */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border space-y-3">
            <div className="h-6 w-1/4 bg-slate-800 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-800/60 rounded"></div>
              <div className="h-4 w-full bg-slate-800/60 rounded"></div>
              <div className="h-4 w-5/6 bg-slate-800/60 rounded"></div>
            </div>
          </div>

          {/* Card 2: Batting Plan */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border space-y-4">
            <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 w-4 bg-slate-800 rounded-full flex-shrink-0"></div>
                  <div className={`h-4 bg-slate-800/60 rounded ${i % 2 === 0 ? 'w-11/12' : 'w-4/5'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeletons */}
        <div className="space-y-6">
          {/* Win Probability Donut */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border flex flex-col items-center space-y-4">
            <div className="h-6 w-1/2 bg-slate-800 rounded"></div>
            <div className="w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center">
              <div className="h-8 w-12 bg-slate-800/60 rounded"></div>
            </div>
            <div className="h-4 w-2/3 bg-slate-800/60 rounded"></div>
          </div>

          {/* Optimal XI Card */}
          <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border space-y-3">
            <div className="h-6 w-1/2 bg-slate-800 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-800/40">
                  <div className="h-4 w-2/3 bg-slate-800/60 rounded"></div>
                  <div className="h-4 w-8 bg-slate-800/40 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
