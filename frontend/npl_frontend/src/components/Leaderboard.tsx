import { useEffect, useState } from "react";

interface LeaderboardRow {
  rank: number;
  user_id: number;
  username: string;
  totalpoints: number;
}

export default function OverallLeaderboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/leaderboard/api/overall/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load leaderboard");
        return res.json();
      })
      .then(data => setRows(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Overall Leaderboard</h1>

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Rank</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.user_id} className="border-t">
              <td className="p-3 font-semibold">#{row.rank}</td>
              <td className="p-3">{row.username}</td>
              <td className="p-3 text-right">{row.totalpoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
