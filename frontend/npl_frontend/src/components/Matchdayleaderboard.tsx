import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface MatchdayRow {
  rank: number;
  user_id: number;
  match_points: number;
  match_id: number;
  match_date: string;
}

export default function MatchdayLeaderboard() {
  const { matchId } = useParams();
  const [rows, setRows] = useState<MatchdayRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/leaderboard/api/matchday/${matchId}/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load matchday leaderboard");
        return res.json();
      })
      .then(data => setRows(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [matchId]);

  if (loading) return <p>Loading matchday leaderboard...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             <span className="text-3xl">⚽</span> Matchday Glory
          </h1>
          <span className="text-brand-red font-black uppercase tracking-widest text-xs bg-red-50 px-4 py-1.5 rounded-full border border-red-100">Battle ID #{matchId}</span>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Rank</th>
                  <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Player ID</th>
                  <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Battle Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row) => {
                  const isTop3 = row.rank <= 3;
                  const rankColors = [
                    "bg-brand-yellow text-brand-blue-dark", // Rank 1
                    "bg-gray-200 text-gray-700",           // Rank 2
                    "bg-[#CD7F32]/20 text-[#CD7F32]"        // Rank 3
                  ];

                  return (
                    <tr key={row.user_id} className={`group transition-colors duration-200 hover:bg-gray-50/50 ${isTop3 ? "bg-white" : ""}`}>
                      <td className="px-10 py-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-xs ${isTop3 ? rankColors[row.rank - 1] : "bg-gray-100 text-gray-500"}`}>
                          #{row.rank}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-brand-blue to-brand-blue-dark text-white flex items-center justify-center font-bold text-sm">
                            <span className="opacity-70">U</span>
                          </div>
                          <span className={`font-extrabold text-gray-900 group-hover:text-brand-red transition-colors ${isTop3 ? "text-xl" : "text-lg"}`}>
                            #{row.user_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className={`font-black tracking-tight ${isTop3 ? "text-2xl text-brand-blue" : "text-xl text-gray-600"}`}>
                          {row.match_points}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Match Points Recorded</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
