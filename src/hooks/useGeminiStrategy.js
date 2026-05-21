import { useState, useCallback } from 'react';

function buildPrompt(match, teams, venues) {
  const teamA = teams.find((t) => t.id === match.teamA?.id) || match.teamA;
  const teamB = teams.find((t) => t.id === match.teamB?.id) || match.teamB;
  const venue = venues.find((v) => v.id === match.venue?.id) || match.venue;

  return `
You are an elite cricket analyst and tactician with 20 years of experience.
Analyze this match setup and return a JSON object ONLY.
No preamble. No explanation. No markdown. Pure JSON.

MATCH CONTEXT:
- Team A: ${teamA?.name} (Batting: ${teamA?.battingStrength}/100, Bowling: ${teamA?.bowlingStrength}/100, Fielding: ${teamA?.fieldingStrength}/100)
- Team B: ${teamB?.name} (Batting: ${teamB?.battingStrength}/100, Bowling: ${teamB?.bowlingStrength}/100, Fielding: ${teamB?.fieldingStrength}/100)
- Format: ${match.format}
- Venue: ${venue?.name}, ${venue?.city} — ${venue?.notes}
- Pitch: ${match.pitchType}
- Avg first innings ${match.format} score here: ${match.format === 'T20' ? venue?.avgFirstInningsT20 : venue?.avgFirstInningsODI}
- Chasing success rate: ${venue?.chasingSuccessPct}%
- Toss: ${match.tossWinner ? `${match.tossWinner} won and chose to ${match.tossDecision}` : 'Not decided'}
- Team A recent form: ${teamA?.recentForm?.join(', ')}
- Team B recent form: ${teamB?.recentForm?.join(', ')}
- Pace effectiveness at venue: ${venue?.paceEffectiveness}/100
- Spin effectiveness at venue: ${venue?.spinEffectiveness}/100
- Dew factor: ${venue?.dewFactor}

Return exactly this JSON structure (no extra fields):
{
  "matchOverview": "2-3 sentence tactical summary",
  "winProbability": {
    "teamA": <number 0-100>,
    "teamB": <number 0-100>,
    "confidence": "Low" | "Medium" | "High",
    "reasoning": "one sentence"
  },
  "battingStrategy": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "bowlingPlan": {
    "powerplay": "specific advice",
    "middleOvers": "specific advice",
    "deathOvers": "specific advice",
    "keyBowlers": ["name1", "name2", "name3"]
  },
  "fieldSetup": ["setup point 1", "setup point 2", "setup point 3"],
  "riskPlayers": [
    { "name": "player name", "reason": "why they are dangerous", "threatLevel": "Medium" | "High" | "Critical" }
  ],
  "keyMoments": ["moment1", "moment2", "moment3"],
  "optimalXI": ["player1", "player2", "player3", "player4", "player5", "player6", "player7", "player8", "player9", "player10", "player11"],
  "bowlingRotation": "paragraph describing over-by-over bowling rotation plan"
}
`.trim();
}

export function useGeminiStrategy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [matchupInsight, setMatchupInsight] = useState(null);
  const [matchupLoading, setMatchupLoading] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // High-fidelity offline fallback data generator
  const generateLocalFallback = useCallback((match, teams, venues) => {
    const teamA = teams?.find((t) => t.id === match.teamA?.id) || match.teamA;
    const teamB = teams?.find((t) => t.id === match.teamB?.id) || match.teamB;
    const venue = venues?.find((v) => v.id === match.venue?.id) || match.venue;

    const threatA = Math.round(((teamA?.battingStrength || 80) + (teamA?.bowlingStrength || 80)) / 2);
    const threatB = Math.round(((teamB?.battingStrength || 80) + (teamB?.bowlingStrength || 80)) / 2);
    const total = threatA + threatB;
    const probA = Math.round((threatA / total) * 100);
    const probB = 100 - probA;

    return {
      matchOverview: `A premier analytical matchup between ${teamA?.name || 'Team A'} and ${teamB?.name || 'Team B'} at the historic ${venue?.name || 'venue'}. The ${match.pitchType || 'Flat'} surface is projected to influence play, with both captains analyzing wind vectors and dew settling indexes.`,
      winProbability: {
        teamA: probA,
        teamB: probB,
        confidence: 'Medium',
        reasoning: `${teamA?.shortName || 'TMA'} has a slight statistical form advantage on this turf.`
      },
      battingStrategy: [
        `Attack pacers aggressively during the first 6 overs to utilize field gaps.`,
        `Build sturdy middle-overs partnerships to offset defensive spin bowling schemes.`,
        `Keep wickets in hand to exploit late overs with muscular clearing targets.`,
        `Adopt deep crease stances to counter early seaming delivery angles.`,
        `Vary scoring speeds to adjust to changing soil moisture levels.`
      ],
      bowlingPlan: {
        powerplay: `Hold strict off-stump seaming channels, forcing driving errors from openers.`,
        middleOvers: `Deploy squeezing fields. Instruct spinners to drop lengths and drift deliveries away.`,
        deathOvers: `Utilize wide-line yorkers and slower-ball bouncers in rotation.`,
        keyBowlers: [`Jasprit Bumrah`, `Mitchell Starc`, `Kagiso Rabada`]
      },
      fieldSetup: [
        `Extra cover wide and deep to block fast driving lanes.`,
        `Deep mid-wicket and square-leg placed for short-pitched trap options.`,
        `Active slip card during seaming powerplay phases.`
      ],
      riskPlayers: [
        {
          name: `Virat Kohli`,
          reason: `Exceptional middle-overs rotation rate and conversion of boundary runs.`,
          threatLevel: `Critical`
        },
        {
          name: `Mitchell Starc`,
          reason: `Averages outstanding powerplay breakthroughs with late left-arm swing lines.`,
          threatLevel: `High`
        }
      ],
      keyMoments: [
        `Early swing battle between openers and new ball seamers.`,
        `Squeezing middle overs phase when spinners operate in tandem.`,
        `High-stakes death overs execution under score-pressure situations.`
      ],
      optimalXI: [
        `Rohit Sharma (Batter)`,
        `Travis Head (Batter)`,
        `Virat Kohli (Batter)`,
        `Babar Azam (Batter)`,
        `Heinrich Klaasen (Wicketkeeper)`,
        `Glenn Maxwell (All-rounder)`,
        `Ravindra Jadeja (All-rounder)`,
        `Rashid Khan (Bowler)`,
        `Jasprit Bumrah (Bowler)`,
        `Mitchell Starc (Bowler)`,
        `Kagiso Rabada (Bowler)`
      ],
      bowlingRotation: `Deliveries 1-4 are assigned to frontline seaming options to establish early wickets. Transition to change-pacers for overs 5-6. Spinners lock down middle periods in alternate spells. Over-by-over rotations alternate at death with strict execution of wide-yorker traps.`
    };
  }, []);

  const generate = useCallback(async (match, teams, venues) => {
    if (!match?.teamA || !match?.teamB) {
      setError('Please select both teams before generating a strategy.');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const startTime = Date.now();
    const prompt = buildPrompt(match, teams, venues);

    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const json = await res.json();
      
      // Ensure skeleton displays for at least 1.5 seconds for visual premium pacing
      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) {
        await delay(1500 - elapsed);
      }

      setData(json.strategy);
    } catch (err) {
      console.warn('Strategy generation failed. Booting offline local simulator...', err);
      
      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) {
        await delay(1500 - elapsed);
      }

      const localResult = generateLocalFallback(match, teams, venues);
      setData(localResult);
      setError('AI Engine operating in localized analysis mode (Offline fallback activated).');
    } finally {
      setLoading(false);
    }
  }, [generateLocalFallback]);

  // Backward compatibility alias
  const generateStrategy = useCallback(async (teamA, teamB, format, venue, pitchType, tossWinner, tossDecision, players) => {
    const matchObj = { teamA, teamB, format, venue, pitchType, tossWinner, tossDecision };
    return await generate(matchObj, players ? [teamA, teamB] : [], []);
  }, [generate]);

  const generateMatchupInsight = useCallback(async (batter, bowler) => {
    if (!batter || !bowler) return;

    setMatchupLoading(true);
    setMatchupInsight(null);

    const promptText = `
You are a master cricket analyst. Write a concise, 1-paragraph tactical analysis (max 3 sentences) detailing the head-to-head matchup between Batter: ${batter.name} (${batter.battingHand}-handed) and Bowler: ${bowler.name} (${bowler.bowlingType}).
Context:
- Batter Strengths: ${batter.strengths?.join(', ')}
- Batter Weaknesses: ${batter.weaknesses?.join(', ')}
- Bowler Strengths: ${bowler.strengths?.join(', ')}
- Batter Form Rating: ${batter.formRating}/100, Bowler Form Rating: ${bowler.formRating}/100.
Specify ideal lengths, expected timing results, and who holds the tactical upper hand. No markdown.
`.trim();

    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!res.ok) {
        throw new Error(`Matchup server error ${res.status}`);
      }

      const json = await res.json();
      setMatchupInsight(json.strategy);
    } catch (err) {
      console.warn('AI matchup simulation failed. Executing mathematical fallback...', err);

      const isWeakness = batter.weaknesses?.some(w => {
        const wl = w.toLowerCase();
        const bt = bowler.bowlingType?.toLowerCase() || '';
        return (wl.includes('left-arm') && bt.includes('left-arm')) ||
               (wl.includes('spin') && bt.includes('spin')) ||
               (wl.includes('short') && bt.includes('fast')) ||
               (wl.includes('swing') && bt.includes('fast'));
      });

      let response = '';
      if (isWeakness) {
        response = `${bowler.name} holds the clear tactical advantage in this duel. Exploiting the batter's weakness against ${batter.weaknesses[0]}, the bowler can utilize express seaming angles to induce an early edge. ${batter.name} must play within their crease and protect off stump.`;
      } else {
        response = `This matchup is extremely balanced. While ${bowler.name} will try to challenge the stance with ${bowler.strengths[0]}, ${batter.name}'s excellent technique in counter-attacking ${batter.strengths[0]} should allow them to neutralize the spell and pick gaps.`;
      }

      await delay(600); // Small delay to feel organic
      setMatchupInsight(response);
    } finally {
      setMatchupLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    generate, 
    generateStrategy, 
    generateMatchupInsight, 
    matchupInsight, 
    matchupLoading, 
    reset 
  };
}
