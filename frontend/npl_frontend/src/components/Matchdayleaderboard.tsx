import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    fetch(`http://127.0.0.1:8000/leaderboard/api/matchday/${matchId}/`)
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">⚽ Matchday Leaderboard</h1>

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Rank</th>
            <th className="p-3">User ID</th>
            <th className="p-3 text-right">Match Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.user_id} className="border-t">
              <td className="p-3 font-semibold">#{row.rank}</td>
              <td className="p-3">{row.user_id}</td>
              <td className="p-3 text-right">{row.match_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
