import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import TeamVsTeam from './pages/TeamVsTeam';
import AIStrategy from './pages/AIStrategy';
import PlayerMatchups from './pages/PlayerMatchups';
import VenueAnalysis from './pages/VenueAnalysis';
import { useGeminiStrategy } from './hooks/useGeminiStrategy';
import { ShieldAlert, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataLoadError, setDataLoadError] = useState('');

  // Central Match Fixture Configuration State
  const [matchConfig, setMatchConfig] = useState({
    teamA: null,
    teamB: null,
    format: 'T20',
    venue: null,
    pitchType: 'Flat',
    tossWinner: '',
    tossDecision: 'bat'
  });

  // Instantiate Google Gemini strategy compiler hook
  const aiState = useGeminiStrategy();

  // Fetch local mock databases on mount
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

        // Prepopulate default fixture setups once datasets are ready
        if (dataTeams.length >= 2 && dataVenues.length > 0) {
          setMatchConfig(prev => ({
            ...prev,
            teamA: dataTeams[0],
            teamB: dataTeams[1],
            venue: dataVenues[0]
          }));
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

  // Handle Generate CTA clicks from the Match Form
  const handleGenerateStrategy = () => {
    setActiveTab('strategy');
  };

  // Dynamic Routing Switch based on activeTab
  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            teams={teams}
            venues={venues}
            matchConfig={matchConfig}
            setMatchConfig={setMatchConfig}
            onGenerate={handleGenerateStrategy}
          />
        );
      case 'team-analysis':
        return <TeamVsTeam matchConfig={matchConfig} players={players} />;
      case 'strategy':
        return (
          <AIStrategy
            matchConfig={matchConfig}
            players={players}
            aiState={aiState}
          />
        );
      case 'matchups':
        return <PlayerMatchups matchConfig={matchConfig} players={players} aiState={aiState} />;
      case 'venue':
        return <VenueAnalysis venues={venues} />;
      default:
        return <Home teams={teams} venues={venues} matchConfig={matchConfig} setMatchConfig={setMatchConfig} onGenerate={handleGenerateStrategy} />;
    }
  };

  // Render main layout
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-cricket-dark text-slate-100 font-body">
      
      {/* Collapsible Left navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content body */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto pb-24 md:pb-8 max-w-7xl mx-auto w-full">
        
        {/* Global database errors */}
        {dataLoadError && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-cricket-red/10 border border-cricket-red/30 text-cricket-red text-sm mb-6 max-w-4xl mx-auto">
            <ShieldAlert className="w-6 h-6 flex-shrink-0 animate-pulse" />
            <span className="font-semibold">{dataLoadError}</span>
          </div>
        )}

        {/* Loading Spinner during initial dataset fetching */}
        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-t-cricket-cyan border-slate-800 animate-spin"></div>
            <p className="font-display tracking-widest text-sm text-slate-400 font-bold uppercase animate-pulse">
              Initializing Strategy Databases...
            </p>
          </div>
        ) : (
          renderActivePage()
        )}
      </main>

    </div>
  );
}
