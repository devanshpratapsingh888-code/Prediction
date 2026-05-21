import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import TeamVsTeam from './pages/TeamVsTeam';
import AIStrategy from './pages/AIStrategy';
import PlayerMatchups from './pages/PlayerMatchups';
import VenueAnalysis from './pages/VenueAnalysis';
import { useGeminiStrategy } from './hooks/useGeminiStrategy';
import { useMatch } from './context/MatchContext';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('/');
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataLoadError, setDataLoadError] = useState('');
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { match, updateMatch } = useMatch();
  const aiState = useGeminiStrategy();

  // Watch viewport resizing for mobile navigation safe margins
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch local mockup data on load
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        setIsLoadingData(true);
        setDataLoadError('');

        const resTeams = await fetch('/data/teams.json');
        if (!resTeams.ok) throw new Error("Failed to load teams database");
        const dataTeams = await resTeams.json();

        const resPlayers = await fetch('/data/players.json');
        if (!resPlayers.ok) throw new Error("Failed to load players database");
        const dataPlayers = await resPlayers.json();

        const resVenues = await fetch('/data/venues.json');
        if (!resVenues.ok) throw new Error("Failed to load venues database");
        const dataVenues = await resVenues.json();

        setTeams(dataTeams);
        setPlayers(dataPlayers);
        setVenues(dataVenues);

        // Prepopulate default fixture setups if context isn't set yet
        if (dataTeams.length >= 2 && dataVenues.length > 0 && !match.teamA) {
          updateMatch({
            teamA: dataTeams[0],
            teamB: dataTeams[1],
            venue: dataVenues[0]
          });
        }
      } catch (err) {
        console.error("Database initialization failed:", err);
        setDataLoadError("Strategic Alert: Failed to initialize local databases. Please verify public assets are intact.");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDatabase();
  }, []);

  // Handle generating tactics triggers
  const handleGenerateStrategy = () => {
    setActiveTab('/strategy');
  };

  const handleNavigate = (path) => {
    setActiveTab(path);
  };

  // Switch pages based on route path
  const renderActivePage = () => {
    switch (activeTab) {
      case '/':
        return (
          <Home
            teams={teams}
            venues={venues}
            onNavigate={handleNavigate}
          />
        );
      case '/team-analysis':
        return <TeamVsTeam players={players} onNavigate={handleNavigate} />;
      case '/strategy':
        return (
          <AIStrategy
            teams={teams}
            venues={venues}
            players={players}
            aiState={aiState}
            onNavigate={handleNavigate}
          />
        );
      case '/matchups':
        return (
          <PlayerMatchups 
            players={players} 
            aiState={aiState} 
            onNavigate={handleNavigate} 
          />
        );
      case '/venue':
        return <VenueAnalysis venues={venues} onNavigate={handleNavigate} />;
      default:
        return (
          <Home
            teams={teams}
            venues={venues}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 font-body flex">
      {/* Sidebar navigation context */}
      <Sidebar currentPath={activeTab} onNavigate={handleNavigate} />

      {/* Main viewport block */}
      <main
        style={{
          marginLeft: isMobile ? 0 : 220,
          paddingBottom: isMobile ? 80 : 0,
          minHeight: '100vh',
          flex: 1,
        }}
        className="p-6 md:p-8 flex flex-col w-full overflow-x-hidden"
      >
        {/* Load failures alerts */}
        {dataLoadError && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-cricket-red/10 border border-cricket-red/30 text-cricket-red text-sm mb-6 max-w-4xl mx-auto w-full no-print">
            <ShieldAlert className="w-6 h-6 flex-shrink-0 animate-pulse" />
            <span className="font-semibold">{dataLoadError}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4 my-auto">
            <div className="w-12 h-12 rounded-full border-4 border-t-cricket-cyan border-slate-800 animate-spin"></div>
            <p className="font-display tracking-widest text-sm text-slate-400 font-bold uppercase animate-pulse">
              Initializing Strategy Databases...
            </p>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-6xl mx-auto">
            {renderActivePage()}
          </div>
        )}
      </main>
    </div>
  );
}
