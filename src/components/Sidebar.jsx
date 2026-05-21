import React from 'react';
import { LayoutDashboard, Users, Cpu, Swords, MapPin } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', label: 'Match Setup', icon: LayoutDashboard },
    { id: 'team-analysis', label: 'Team Compare', icon: Users },
    { id: 'strategy', label: 'AI Strategy', icon: Cpu },
    { id: 'matchups', label: 'Matchups', icon: Swords },
    { id: 'venue', label: 'Venue Analysis', icon: MapPin },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-cricket-card border-r border-cricket-border h-screen sticky top-0">
        {/* Brand Logo */}
        <div className="p-6 border-b border-cricket-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cricket-cyan/10 border border-cricket-cyan flex items-center justify-center text-cricket-cyan font-bold text-xl font-display">
            🏏
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-white tracking-wider leading-none">
              CRICKET
            </h1>
            <span className="text-xs text-cricket-cyan uppercase font-display tracking-widest font-semibold">
              Strategy Engine
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? 'bg-cricket-cyan/10 text-cricket-cyan border border-cricket-cyan/30 shadow-[0_0_15px_rgba(56,189,248,0.05)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className="font-display tracking-wider text-sm uppercase">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-cricket-border text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-display font-medium">
            AI TACTICS v2.0
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-cricket-card border-t border-cricket-border z-50 flex justify-around py-2 px-1 shadow-[0_-5px_15px_rgba(10,15,30,0.8)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-all ${
                isActive ? 'text-cricket-cyan scale-105 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wider font-display font-medium">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
