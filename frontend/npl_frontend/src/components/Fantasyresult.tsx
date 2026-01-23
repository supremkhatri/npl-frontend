import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Player {
  player_name: string;
  role: string;
  base_points: number;
  final_points: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export default function FantasyResults() {
  const { matchId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/fantasy/results/${matchId}/`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players);
        setTotal(data.total_points);
      })
      .catch(console.error);
  }, [matchId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Fantasy Results</h1>

      <p className="text-gray-500 mb-6">Total Points: {total}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {players.map((p, idx) => (
          <div key={idx} className="p-6 rounded-2xl shadow-md bg-white">
            <div className="flex justify-between">
              <h2 className="font-bold text-lg">{p.player_name}</h2>
              <span className="text-sm font-bold">
                {p.final_points} pts
              </span>
            </div>

            <p className="text-gray-500 mt-2">{p.role}</p>
            {p.is_captain && (
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                Captain
              </span>
            )}
            {p.is_vice_captain && (
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                Vice Captain
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
