/**
 * Cricket Strategy Engine Helper Utilities
 */

// Generate a deterministic but realistic head-to-head record based on team attributes
export function getHeadToHead(teamA, teamB) {
  if (!teamA || !teamB) return { winsA: 0, winsB: 0, draws: 0, total: 0 };
  
  // Calculate relative strength ratio
  const strengthA = (teamA.battingStrength + teamA.bowlingStrength + teamA.fieldingStrength) / 3;
  const strengthB = (teamB.battingStrength + teamB.bowlingStrength + teamB.fieldingStrength) / 3;
  
  const totalMatches = 28; // Standard sample size
  const ratioA = strengthA / (strengthA + strengthB);
  
  // Deterministic but realistic split
  let winsA = Math.round(totalMatches * ratioA * 0.95);
  let winsB = Math.round(totalMatches * (1 - ratioA) * 0.95);
  let draws = totalMatches - winsA - winsB;
  
  // Adjust draws to represent abandoned/tied matches in limited overs
  if (draws < 0) draws = 0;
  
  return {
    winsA,
    winsB,
    draws,
    total: totalMatches
  };
}

// Format recent form array into a clean spaced string or element mapping
export function formatRecentForm(formArray) {
  if (!formArray || !Array.isArray(formArray)) return "";
  return formArray.join(" ");
}

// Calculate phase-wise stats dynamically from player data
export function getPhaseStats(teamId, players) {
  const teamPlayers = players.filter(p => p.teamId === teamId);
  
  // Powerplay score based on top batters and powerplay bowlers
  const batters = teamPlayers.filter(p => p.role === "Batter" || p.role === "Wicketkeeper-Batter" || p.role === "All-Rounder");
  const bowlers = teamPlayers.filter(p => p.role === "Bowler" || p.role === "All-Rounder");
  
  // Average strike rates for top order
  const topOrder = batters.slice(0, 3);
  const middleOrder = batters.slice(2, 5);
  const finishers = batters.filter(p => p.strengths.some(s => s.includes("finish") || s.includes("power") || s.includes("destruction")));
  
  const ppSR = topOrder.reduce((acc, p) => acc + p.strikeRate, 0) / (topOrder.length || 1);
  const midSR = middleOrder.reduce((acc, p) => acc + p.strikeRate, 0) / (middleOrder.length || 1);
  
  // Death scoring speed: finishers or high strike rate all-rounders
  const deathSR = finishers.length > 0 
    ? finishers.reduce((acc, p) => acc + p.strikeRate, 0) / finishers.length 
    : batters.reduce((acc, p) => acc + Math.max(p.strikeRate, 135), 0) / (batters.length || 1);

  // Grouped stats mapping (average runs expected in T20 per phase)
  return {
    powerplay: Math.round((ppSR / 100) * 36 * 0.9), // T20 6 overs (36 balls)
    middleOvers: Math.round((midSR / 100) * 60 * 0.8), // T20 10 overs (60 balls)
    deathOvers: Math.round((deathSR / 100) * 24 * 1.1) // T20 4 overs (24 balls)
  };
}

// Generate realistic simulated matchup statistics between any batter and bowler
export function getMatchupStats(batter, bowler) {
  if (!batter || !bowler) {
    return {
      runs: 0,
      balls: 0,
      dismissals: 0,
      strikeRate: 0,
      dotBallPct: 0,
      boundaryPct: 0
    };
  }

  // Base simulation variables
  let baseSR = batter.strikeRate || 135.0;
  let baseAvg = batter.battingAvg || 35.0;
  let economy = bowler.economy || 7.5;
  let bowlAvg = bowler.bowlingAvg || 24.0;

  let dismissals = Math.floor((100 - batter.formRating + (100 - bowler.formRating)) / 30) + 1;
  if (dismissals < 1) dismissals = 1;
  
  let runs = Math.round(dismissals * baseAvg * (baseSR / 135) * (7.5 / economy) * 0.95);
  let balls = Math.round((runs / baseSR) * 100);

  // Apply strengths and weaknesses modifications
  let advantage = 0; // Negative for bowler advantage, positive for batter advantage

  // Check batter weaknesses against bowler type
  if (bowler.bowlingType) {
    const typeLower = bowler.bowlingType.toLowerCase();
    batter.weaknesses.forEach(weak => {
      const w = weak.toLowerCase();
      if (w.includes("left-arm") && typeLower.includes("left-arm")) advantage -= 20;
      if (w.includes("spin") && (typeLower.includes("spin") || typeLower.includes("orthodox"))) advantage -= 15;
      if (w.includes("swing") && typeLower.includes("fast")) advantage -= 15;
      if (w.includes("short") && typeLower.includes("fast")) advantage -= 10;
    });
  }

  // Check batter strengths against bowler
  if (bowler.bowlingType) {
    const typeLower = bowler.bowlingType.toLowerCase();
    batter.strengths.forEach(str => {
      const s = str.toLowerCase();
      if (s.includes("spin") && typeLower.includes("spin")) advantage += 15;
      if (s.includes("pace") && typeLower.includes("fast")) advantage += 10;
    });
  }

  // Bowler strengths adjustments
  bowler.strengths.forEach(str => {
    const s = str.toLowerCase();
    if (s.includes("yorker") || s.includes("death")) {
      advantage -= 5;
    }
  });

  // Apply adjustments to runs and balls
  let finalSR = baseSR + (advantage * 0.8);
  if (finalSR < 85) finalSR = 85;
  
  runs = Math.round(runs * (1 + advantage / 150));
  balls = Math.round((runs / finalSR) * 100);
  
  if (balls < 6) balls = 6;
  if (runs < 0) runs = 0;

  // Dot ball and Boundary calculations
  let dotBallPct = Math.round(35 - (finalSR - 130) / 4 - advantage / 5);
  if (dotBallPct > 60) dotBallPct = 60;
  if (dotBallPct < 20) dotBallPct = 20;

  let boundaryPct = Math.round((finalSR / 10) - 4 + advantage / 10);
  if (boundaryPct > 30) boundaryPct = 30;
  if (boundaryPct < 5) boundaryPct = 5;

  return {
    runs,
    balls,
    dismissals,
    strikeRate: parseFloat(finalSR.toFixed(1)),
    dotBallPct,
    boundaryPct
  };
}

// Get threat level color styles for Tailwind CSS
export function getThreatColor(level) {
  switch (level?.toLowerCase()) {
    case "low":
      return "bg-cricket-green/10 text-cricket-green border-cricket-green/30";
    case "medium":
      return "bg-cricket-cyan/10 text-cricket-cyan border-cricket-cyan/30";
    case "high":
      return "bg-cricket-amber/10 text-cricket-amber border-cricket-amber/30";
    case "critical":
      return "bg-cricket-red/10 text-cricket-red border-cricket-red/30 animate-pulse";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
}

// Format probability to nice percentage
export function formatProbability(prob) {
  if (typeof prob !== "number") return "50%";
  return `${Math.round(prob)}%`;
}
