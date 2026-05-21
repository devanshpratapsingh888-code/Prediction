import React, { useState, useEffect } from 'react';
import VenueCard from '../components/VenueCard';
import { BookOpen, Award, HelpCircle } from 'lucide-react';
import { useMatch } from '../context/MatchContext';

export default function VenueAnalysis({ venues, onNavigate }) {
  const { match } = useMatch();
  const [selectedVenueId, setSelectedVenueId] = useState('');

  // Default selection on load to the active context venue
  useEffect(() => {
    if (match.venue?.id) {
      setSelectedVenueId(match.venue.id);
    } else if (venues.length > 0) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, match.venue]);

  // Guard Empty State: No match configured
  if (!match.teamA || !match.teamB) {
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

  const activeVenue = venues.find(v => v.id === selectedVenueId);

  // Leaderboard data
  const getTopPerformers = (venueId) => {
    const records = {
      wankhede: {
        batting: [
          { name: "Rohit Sharma", runs: 852, avg: 42.6, sr: 158.4 },
          { name: "Virat Kohli", runs: 620, avg: 51.6, sr: 145.2 },
          { name: "Nicholas Pooran", runs: 412, avg: 37.5, sr: 165.8 }
        ],
        bowling: [
          { name: "Jasprit Bumrah", wickets: 24, economy: 6.64, avg: 18.2 },
          { name: "Wanindu Hasaranga", wickets: 16, economy: 7.02, avg: 20.1 },
          { name: "Matheesha Pathirana", wickets: 12, economy: 7.24, avg: 19.5 }
        ]
      },
      mcg: {
        batting: [
          { name: "Virat Kohli", runs: 580, avg: 64.4, sr: 136.2 },
          { name: "Steve Smith", runs: 490, avg: 49.0, sr: 124.5 },
          { name: "Travis Head", runs: 320, avg: 35.5, sr: 140.2 }
        ],
        bowling: [
          { name: "Mitchell Starc", wickets: 20, economy: 7.15, avg: 21.0 },
          { name: "Pat Cummins", wickets: 18, economy: 7.32, avg: 22.4 },
          { name: "Kagiso Rabada", wickets: 14, economy: 7.52, avg: 24.1 }
        ]
      },
      lords: {
        batting: [
          { name: "Joe Root", runs: 712, avg: 54.8, sr: 122.3 },
          { name: "Jos Buttler", runs: 540, avg: 45.0, sr: 142.6 },
          { name: "Ben Stokes", runs: 480, avg: 40.0, sr: 132.8 }
        ],
        bowling: [
          { name: "Jofra Archer", wickets: 18, economy: 6.95, avg: 19.4 },
          { name: "Trent Boult", wickets: 15, economy: 7.08, avg: 21.2 },
          { name: "Tim Southee", wickets: 14, economy: 7.62, avg: 23.5 }
        ]
      },
      "eden-gardens": {
        batting: [
          { name: "Virat Kohli", runs: 680, avg: 56.6, sr: 139.5 },
          { name: "Rohit Sharma", runs: 590, avg: 39.3, sr: 144.6 },
          { name: "Andre Russell", runs: 485, avg: 34.6, sr: 178.4 }
        ],
        bowling: [
          { name: "Ravindra Jadeja", wickets: 19, economy: 6.85, avg: 22.1 },
          { name: "Wanindu Hasaranga", wickets: 15, economy: 6.72, avg: 18.5 },
          { name: "Adil Rashid", wickets: 12, economy: 7.12, avg: 23.4 }
        ]
      },
      newlands: {
        batting: [
          { name: "Quinton de Kock", runs: 512, avg: 39.4, sr: 138.6 },
          { name: "David Miller", runs: 440, avg: 44.0, sr: 142.1 },
          { name: "Heinrich Klaasen", runs: 395, avg: 49.3, sr: 161.4 }
        ],
        bowling: [
          { name: "Kagiso Rabada", wickets: 25, economy: 7.24, avg: 19.8 },
          { name: "Anrich Nortje", wickets: 18, economy: 7.42, avg: 20.5 },
          { name: "Mitchell Starc", wickets: 14, economy: 7.12, avg: 22.1 }
        ]
      },
      dubai: {
        batting: [
          { name: "Babar Azam", runs: 624, avg: 48.0, sr: 128.5 },
          { name: "Mohammad Rizwan", runs: 580, avg: 52.7, sr: 125.4 },
          { name: "Jos Buttler", runs: 390, avg: 39.0, sr: 138.2 }
        ],
        bowling: [
          { name: "Wanindu Hasaranga", wickets: 22, economy: 6.45, avg: 16.5 },
          { name: "Maheesh Theekshana", wickets: 14, economy: 6.52, avg: 19.2 },
          { name: "Adam Zampa", wickets: 12, economy: 6.82, avg: 20.8 }
        ]
      }
    };

    return records[venueId] || {
      batting: [
        { name: "Virat Kohli", runs: 400, avg: 45.0, sr: 135.0 },
        { name: "Rohit Sharma", runs: 350, avg: 38.0, sr: 140.0 }
      ],
      bowling: [
        { name: "Jasprit Bumrah", wickets: 12, economy: 7.1, avg: 22.0 },
        { name: "Mitchell Starc", wickets: 10, economy: 7.5, avg: 24.0 }
      ]
    };
  };

  // AI simulated briefs per venue
  const getVenueNotes = (venueId) => {
    const notes = {
      wankhede: [
        "Chasing teams hold a significant advantage in night matches due to heavy dew slickness after 8 PM.",
        "Expect extreme lateral movement for pacers in the first 2-3 overs using the new white ball.",
        "Batters should target short straight boundary segments, especially off spinners who drop their length.",
        "Avoid bowling spin past over #12 as the wet ball becomes difficult to grip."
      ],
      mcg: [
        "Large boundary dimensions favor defensive bowling strategies; fielders must patrol deep-three quarters.",
        "Hit-the-deck pace bowling is highly successful here due to consistent tennis-ball bounce parameters.",
        "Batters must focus on hard running and converting twos rather than attempting flat-six sweeps.",
        "Defending teams hold an advantage; winning the toss should prompt batting first to establish board pressure."
      ],
      lords: [
        "The unique Lord's slope creates natural angles; right-arm over pacers should target the corridor of uncertainty.",
        "Overcast weather heavily amplifies seam movement; check atmospheric radar before selecting your starting XI.",
        "Top-order batters must play close to their body in the first hour to neutralize late-swing traps.",
        "Spinners should focus on container lines from the Nursery End to build pressure."
      ],
      "eden-gardens": [
        "A traditional turning surface. Leg-spinners and carrom-ball bowlers must operate in tandem during the middle overs.",
        "The square boundaries are medium-sized; batters should prioritize sweeps and slog-sweeps with the spin.",
        "Heavy evening dew makes chasing highly advantageous in late night fixtures.",
        "New ball bowlers must maintain a fuller length to extract any early subcontinental seam grip."
      ],
      newlands: [
        "Outstanding pace and bounce all day. Fast bowlers should utilize aggressive bouncers to force errors.",
        "Atmospheric drafts off the mountain can increase swing; hold strict off-stump channels.",
        "Batting becomes progressively smoother after the first 15 overs as the seam flattens.",
        "Spinners act primarily as contains; hold deep mid-wicket sweepers."
      ],
      dubai: [
        "Slow and low pitch parameters favor slower balls, cutters, and accurate wrist-spin setups.",
        "Stroke play requires patience; batters must wait for slower-ball release cues before driving.",
        "Chasing is a statistically dominant strategy due to consistent dew settling.",
        "Bowl full wide-yorkers during death overs to force batters to slice to deep-point segments."
      ]
    };
    return notes[venueId] || [
      "Assess dry pitch moisture before selecting starting spinners.",
      "Keep wickets in hand during the powerplay phase.",
      "Vary bowling speeds to test batter timing metrics."
    ];
  };

  const performers = getTopPerformers(selectedVenueId);
  const venueNotes = getVenueNotes(selectedVenueId);

  return (
    <div className="space-y-8 pb-12 page-enter">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide uppercase">
            Ground conditions dashboard
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Contrast stadium parameters, historic record splits, and AI tactical ground briefings
          </p>
        </div>

        {/* Dropdown selector */}
        <div className="w-full sm:w-64">
          <select
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
            className="w-full bg-cricket-card text-white rounded-xl border border-cricket-border px-4 py-3 focus:outline-none focus:border-cricket-cyan transition font-display font-semibold"
          >
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                🏟️ {v.name} ({v.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeVenue ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Stats Card */}
          <div className="lg:col-span-2">
            <VenueCard venue={activeVenue} />
          </div>

          {/* Sidebar Analytics */}
          <div className="space-y-6">
            
            {/* AI Venue Notes Card */}
            <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition-all duration-300">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <BookOpen className="w-5 h-5 text-cricket-cyan" />
                <h3 className="text-base font-bold font-display text-white uppercase tracking-wider">
                  AI Ground Briefing
                </h3>
              </div>
              <ul className="space-y-3">
                {venueNotes.map((note, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="text-cricket-cyan font-bold select-none">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Leaderboard Cards */}
            <div className="bg-cricket-card p-6 rounded-2xl border border-cricket-border shadow-xl hover:border-cricket-cyan/20 transition-all duration-300">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <Award className="w-5 h-5 text-cricket-amber" />
                <h3 className="text-base font-bold font-display text-white uppercase tracking-wider">
                  Ground Record Holders
                </h3>
              </div>

              <div className="space-y-4">
                {/* Batting Leaderboard */}
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-display block mb-2">Top Run Scorers</span>
                  <div className="space-y-1.5 font-display">
                    {performers.batting.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-800/40 text-xs font-semibold text-slate-300">
                        <span>{idx+1}. {p.name}</span>
                        <span className="text-cricket-cyan">{p.runs} runs <span className="text-[10px] text-slate-500 font-mono font-sans">(SR {p.sr})</span></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bowling Leaderboard */}
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-display block mb-2 mt-2">Top Wicket Takers</span>
                  <div className="space-y-1.5 font-display">
                    {performers.bowling.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-800/40 text-xs font-semibold text-slate-300">
                        <span>{idx+1}. {p.name}</span>
                        <span className="text-cricket-amber">{p.wickets} Wkts <span className="text-[10px] text-slate-500 font-mono font-sans">(Econ {p.economy})</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-cricket-card p-8 rounded-2xl border border-cricket-border text-center text-slate-400">
          Loading venue data...
        </div>
      )}

    </div>
  );
}
