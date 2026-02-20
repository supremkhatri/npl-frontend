import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Match {
  match_id: number;
  team1: string;
  team2: string;
}

interface LeaderboardRow {
  rank: number;
  user_id: number;
  username: string;
  total_points: number;
}

export default function OverallLeaderboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number | "all">("all");
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch matches
  useEffect(() => {
    fetch(`${API_BASE_URL}/fantasy/matches/`)
      .then(res => res.json())
      .then(data => setMatches(data.matches))
      .catch(console.error);
  }, []);

  // Fetch leaderboard
  useEffect(() => {
    setLoading(true);

    const url =
      selectedMatch === "all"
        ? `${API_BASE_URL}/leaderboard/api/overall/`
        : `${API_BASE_URL}/leaderboard/api/match/${selectedMatch}/`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setRows(data.leaderboard);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedMatch]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-80">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 lg:sticky lg:top-28">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-red rounded-full"></span>
              Filter Arena
            </h2>
            
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Select Competition</label>
              <div className="relative group">
                <select
                  value={selectedMatch}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedMatch(value === "all" ? "all" : parseInt(value));
                  }}
                  className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl appearance-none font-bold text-gray-700 focus:outline-none focus:border-brand-red transition-all cursor-pointer group-hover:bg-white"
                >
                  <option value="all">Overall Season</option>
                  {matches.map((m) => (
                    <option key={`match-${m.match_id}`} value={m.match_id}>
                      🏏 {m.team1} vs {m.team2}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-red transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
              <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">Pro Tip</p>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">Top players analyze individual match data to optimize their season-long strategy.</p>
            </div>
          </div>
        </aside>

        {/* Leaderboard Main */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {selectedMatch === "all" ? "Champion's Leaderboard" : "Match Glory"}
            </h1>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Updated Live • Matchday 12</span>
          </div>

          {loading ? (
            <div className="bg-white rounded-[40px] p-20 shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-brand-red mb-4"></div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Calculating Rankings...</p>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Rank</th>
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Tactician</th>
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Draft Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map((row) => {
                      const isTop3 = row.rank <= 3;
                      const rankColors = [
                        "bg-brand-yellow text-brand-blue-dark", // Rank 1
                        "bg-gray-200 text-gray-700",           // Rank 2
                        "bg-[#CD7F32]/20 text-[#CD7F32]"        // Rank 3 (Bronze-ish)
                      ];
                      
                      return (
                        <tr key={row.user_id} className={`group transition-colors duration-200 hover:bg-gray-50/50 ${isTop3 ? "bg-white" : ""}`}>
                          <td className="px-8 py-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${isTop3 ? rankColors[row.rank - 1] : "bg-gray-100 text-gray-500"}`}>
                              #{row.rank}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase ${isTop3 ? "ring-2 ring-offset-2 ring-gray-100" : ""}`} style={{ backgroundColor: `hsl(${row.user_id * 40 % 360}, 70%, 90%)`, color: `hsl(${row.user_id * 40 % 360}, 70%, 30%)` }}>
                                {row.username.charAt(0)}
                              </div>
                              <span className={`font-extrabold text-gray-900 group-hover:text-brand-red transition-colors ${isTop3 ? "text-lg" : "text-base"}`}>
                                {row.username}
                                {isTop3 && row.rank === 1 && <span className="ml-2 text-xl">👑</span>}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className={`font-black tracking-tight ${isTop3 ? "text-xl text-brand-blue" : "text-lg text-gray-600"}`}>
                              {row.total_points.toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-8 py-32 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Arena Data Yet</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
