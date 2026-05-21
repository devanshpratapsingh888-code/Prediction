import { createContext, useContext, useState } from 'react';

const MatchContext = createContext(null);

export const defaultMatch = {
  teamA: null,
  teamB: null,
  format: 'T20',
  venue: null,
  pitchType: 'Flat',
  tossWinner: null,
  tossDecision: 'bat',
};

export function MatchProvider({ children }) {
  const [match, setMatch] = useState(defaultMatch);

  const updateMatch = (updates) =>
    setMatch((prev) => ({ ...prev, ...updates }));

  const resetMatch = () => setMatch(defaultMatch);

  return (
    <MatchContext.Provider value={{ match, updateMatch, resetMatch }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error('useMatch must be used inside MatchProvider');
  return ctx;
}
