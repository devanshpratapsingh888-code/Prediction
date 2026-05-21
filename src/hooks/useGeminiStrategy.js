import { useState, useCallback } from 'react';

export function useGeminiStrategy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [matchupInsight, setMatchupInsight] = useState(null);
  const [matchupLoading, setMatchupLoading] = useState(false);

  // Helper to wait for a minimum duration
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Client-side fallback generator to provide realistic strategy if API fails or is unconfigured
  const generateLocalFallback = (teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, players) => {
    const teamAPlayers = players.filter(p => p.teamId === teamA.id);
    const teamBPlayers = players.filter(p => p.teamId === teamB.id);

    const batterNames = teamAPlayers.filter(p => p.role.includes("Batter") || p.role.includes("keeper")).map(p => p.name);
    const bowlerNames = teamAPlayers.filter(p => p.role.includes("Bowler") || p.role.includes("All")).map(p => p.name);
    const oppBatters = teamBPlayers.filter(p => p.role.includes("Batter") || p.role.includes("keeper"));
    const oppBowlers = teamBPlayers.filter(p => p.role.includes("Bowler") || p.role.includes("All"));

    const threatA = Math.round((teamA.battingStrength + teamA.bowlingStrength) / 2);
    const threatB = Math.round((teamB.battingStrength + teamB.bowlingStrength) / 2);
    const totalThreat = threatA + threatB;
    const probA = Math.round((threatA / totalThreat) * 100);
    const probB = 100 - probA;

    // Pick dynamic risk players from opponents
    const riskPlayers = oppBatters.slice(0, 2).map(p => ({
      name: p.name,
      reason: `Highly dangerous batter with an average of ${p.battingAvg} and strike rate of ${p.strikeRate}. Vulnerable to: ${p.weaknesses[0]}.`,
      threatLevel: p.formRating > 90 ? "Critical" : "High"
    })).concat(oppBowlers.slice(0, 1).map(p => ({
      name: p.name,
      reason: `Key strike bowler averaging ${p.bowlingAvg || 22.0} with a form rating of ${p.formRating}/100. Excels at: ${p.strengths[0]}.`,
      threatLevel: "High"
    })));

    // Generate playing XI
    const xi = [...teamAPlayers].sort((a, b) => {
      // Sort batters first, then all rounders, then bowlers
      const roleWeight = (role) => {
        if (role.includes("keeper")) return 1;
        if (role.includes("Batter")) return 2;
        if (role.includes("All")) return 3;
        return 4;
      };
      return roleWeight(a.role) - roleWeight(b.role);
    }).slice(0, 11).map(p => `${p.name} (${p.role})`);

    // Add extra fill in case we have fewer than 11 players
    while (xi.length < 11) {
      xi.push(`Substitute Player ${xi.length + 1} (All-Rounder)`);
    }

    return {
      matchOverview: `A highly anticipated ${format} matchup between ${teamA.name} and ${teamB.name} at ${venue.name}. The pitch conditions are reported as ${pitchType}, which will heavily dictate team strategies. ${tossWinner ? `${tossWinner} winning the toss and choosing to ${tossDecision} gives them an early analytical advantage.` : "The toss will be vital to assess dew factors."}`,
      winProbability: {
        teamA: probA,
        teamB: probB,
        confidence: totalThreat > 175 ? "High" : "Medium"
      },
      battingStrategy: [
        `Exploit the ${pitchType === "Flat" ? "belter of a track" : pitchType.toLowerCase() + " surface"} in the early powerplay overs using top order batsmen.`,
        `Build solid partnerships during the middle overs, neutralizing their key spinners like ${oppBowlers.filter(p => p.bowlingType?.includes("spin"))[0]?.name || "opposing spinners"}.`,
        `Keep wickets in hand to target the death-overs rotation, focusing on scoring off boundary lengths.`,
        `Utilize sweeps and crease movement if the pitch is behaving as a ${pitchType}.`,
        `Ensure clear communication in running to pressure fields on large dimensions like ${venue.name}.`
      ],
      bowlingPlan: {
        powerplay: `Deploy swing bowlers early to target weaknesses like ${oppBatters[0]?.weaknesses[0] || "early movement"}. Hold standard off-stump channels.`,
        middleOvers: `Deploy squeeze fields. Roll fingers over the ball if playing on ${pitchType}. Spinners must focus on darting variations.`,
        deathOvers: `Execute wide yorkers and slower ball bouncers. Restrict field access to cow-corner and straight boundaries.`,
        keyBowlers: bowlerNames.slice(0, 3)
      },
      fieldSetup: [
        "Extra cover kept wide to block deep driving corridors.",
        "Deep mid-wicket and square leg back for bouncer traps.",
        "Slip cordon active for the new ball swing phase."
      ],
      riskPlayers: riskPlayers,
      keyMoments: [
        `The first 6 overs of the powerplay where new ball swing will test ${teamA.name}'s openers.`,
        `The spin matchup in the middle overs (overs 11-15) on ${venue.name}'s pitch.`,
        `The execution of death overs (overs 17-20) against heavy hitters.`
      ],
      optimalXI: xi,
      bowlingRotation: `Over 1-4: Start with primary pacers to capture early wickets. Over 5-6: Transition to first-change bowlers. Over 7-15: Squeeze middle-overs with spinners operating in tandem. Over 16-20: Rotate death specialist bowlers in short 1-over spells, mixing wide yorkers with slow bouncers.`
    };
  };

  // Main generator function for full match strategy
  const generateStrategy = useCallback(async (teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, players) => {
    setLoading(true);
    setError(null);
    setData(null);

    const startTime = Date.now();

    const prompt = `You are an expert cricket analyst and tactician.
Analyze this match and return a JSON object ONLY — no preamble, no markdown, no explanation.

MATCH CONTEXT:
- Team A: ${teamA.name} (batting strength: ${teamA.battingStrength}/100, bowling: ${teamA.bowlingStrength}/100)
- Team B: ${teamB.name} (batting strength: ${teamB.battingStrength}/100, bowling: ${teamB.bowlingStrength}/100)
- Format: ${format}
- Venue: ${venue.name} — ${venue.notes}
- Pitch: ${pitchType}
- Toss: ${tossWinner ? tossWinner : 'Toss not yet completed'} chose to ${tossDecision ? tossDecision : 'N/A'}
- Team A Recent Form: ${teamA.recentForm.join(', ')}
- Team B Recent Form: ${teamB.recentForm.join(', ')}

Return this exact JSON structure:
{
  "matchOverview": "string (2-3 sentences)",
  "winProbability": { "teamA": ${teamA.id === tossWinner ? 55 : 50}, "teamB": ${teamB.id === tossWinner ? 45 : 50}, "confidence": "Low|Medium|High" },
  "battingStrategy": ["point1", "point2", "point3", "point4", "point5"],
  "bowlingPlan": {
    "powerplay": "string",
    "middleOvers": "string",
    "deathOvers": "string",
    "keyBowlers": ["bowler1", "bowler2", "bowler3"]
  },
  "fieldSetup": ["setup1", "setup2", "setup3"],
  "riskPlayers": [
    { "name": "string", "reason": "string", "threatLevel": "Medium|High|Critical" }
  ],
  "keyMoments": ["moment1", "moment2", "moment3"],
  "optimalXI": ["player1", "player2", "...up to 11 players with roles"],
  "bowlingRotation": "string paragraph describing over-by-over rotation"
}`;

    // Inline fetch helper with single-retry logic
    const fetchApi = async (attempt = 1) => {
      try {
        const response = await fetch('/api/strategy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ matchContext: prompt }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! status: ${response.status}`);
        }

        const resData = await response.json();
        if (!resData.strategy) {
          throw new Error("Invalid API response format");
        }

        return JSON.parse(resData.strategy);
      } catch (err) {
        if (attempt < 2) {
          console.warn(`Attempt ${attempt} failed. Retrying...`, err);
          await delay(1000);
          return await fetchApi(attempt + 1);
        }
        throw err;
      }
    };

    try {
      const result = await fetchApi(1);
      
      // Enforce premium 2-second skeleton loading experience
      const elapsed = Date.now() - startTime;
      if (elapsed < 2000) {
        await delay(2000 - elapsed);
      }
      
      setData(result);
    } catch (err) {
      console.error("Gemini API strategy fetch failed. Booting local simulation fallback...", err);
      
      // Local fallback generation
      const localResult = generateLocalFallback(teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, players);
      
      // Enforce 2-second delay even on fallback
      const elapsed = Date.now() - startTime;
      if (elapsed < 2000) {
        await delay(2000 - elapsed);
      }

      setData(localResult);
      // Log notification of local backup simulation
      setError("AI Engine operating in localized analysis mode (Offline fallback activated).");
    } finally {
      setLoading(false);
    }
  }, []);

  // Player Matchup Specific Insight
  const generateMatchupInsight = useCallback(async (batter, bowler) => {
    setMatchupLoading(true);
    setMatchupInsight(null);

    const prompt = `You are a cricket tactician. Write a concise, 1-paragraph tactical analysis (max 3 sentences) detailing the head-to-head matchup between Batter: ${batter.name} (${batter.battingHand}-handed) and Bowler: ${bowler.name} (${bowler.bowlingType}). 
Matchup context:
- Batter Strengths: ${batter.strengths.join(', ')}
- Batter Weaknesses: ${batter.weaknesses.join(', ')}
- Bowler Strengths: ${bowler.strengths.join(', ')}
- Batter Form Rating: ${batter.formRating}/100, Bowler Form Rating: ${bowler.formRating}/100.
Discuss exactly what lengths/lines the bowler should bowl, how the batter should react, and who has the upper hand. Keep it extremely expert and short. No markdown code blocks.`;

    const fetchApiMatchup = async (attempt = 1) => {
      try {
        const response = await fetch('/api/strategy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ matchContext: prompt }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resData = await response.json();
        return resData.strategy.trim();
      } catch (err) {
        if (attempt < 2) {
          await delay(1000);
          return await fetchApiMatchup(attempt + 1);
        }
        throw err;
      }
    };

    try {
      const result = await fetchApiMatchup(1);
      setMatchupInsight(result);
    } catch (err) {
      console.warn("Failed to generate AI matchup insight. Generating local matchup analysis...", err);
      
      // Premium local math-based fallback
      const isWeak = batter.weaknesses.some(w => {
        const wl = w.toLowerCase();
        const bt = bowler.bowlingType?.toLowerCase() || "";
        return (wl.includes("left-arm") && bt.includes("left-arm")) || 
               (wl.includes("spin") && (bt.includes("spin") || bt.includes("orthodox"))) ||
               (wl.includes("short") && bt.includes("fast")) ||
               (wl.includes("swing") && bt.includes("fast"));
      });

      let localInsight = "";
      if (isWeak) {
        localInsight = `${bowler.name} holds a clear tactical advantage in this duel. By exploiting ${batter.name}'s susceptibility to ${batter.weaknesses[0]}, ${bowler.name} can utilize their signature ${bowler.strengths[0]} to cramp the batter. ${batter.name} must remain defensive and look to rotate strike to avoid throwing away their wicket early.`;
      } else {
        localInsight = `This is a highly competitive, balanced matchup. While ${bowler.name} will try to challenge ${batter.name} with ${bowler.strengths[0]}, the batter's proficiency in ${batter.strengths[0]} allows them to neutralize these lengths. Expect ${batter.name} to dictate terms if ${bowler.name} misses their mark by even a few inches.`;
      }
      
      await delay(800); // realistic feel
      setMatchupInsight(localInsight);
    } finally {
      setMatchupLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    matchupInsight,
    matchupLoading,
    generateStrategy,
    generateMatchupInsight
  };
}
