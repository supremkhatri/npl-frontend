import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Player {
  player_name: string;
  role: string;
  base_points: number;
  final_points: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export default function FantasyResults() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/fantasy/results/${matchId}/`,
          {
            credentials: "include", // ✅ REQUIRED
          }
        );

        // 🔐 Not logged in
        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch fantasy results");
        }

        const data = await res.json();

        setPlayers(data.players);
        setTotal(data.total_points);
      } catch (err) {
        console.error("FantasyResults error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [matchId, navigate]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading fantasy results...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Fantasy Results</h1>

      <p className="text-gray-600 mb-6 font-semibold">
        Total Points: {total}
      </p>

      {players.length === 0 && (
        <p className="text-gray-500">No results available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {players.map((p, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl shadow-md bg-white"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">{p.player_name}</h2>
              <span className="text-sm font-bold text-red-600">
                {p.final_points} pts
              </span>
            </div>

            <p className="text-gray-500 mt-2">{p.role}</p>

            <div className="mt-3 flex gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}
