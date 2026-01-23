import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Match {
  match_id: number;
  match_date: string;
  team1: string;
  team2: string;
}

export default function FantasyMatchList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/fantasy/matches/")
      .then((res) => res.json())
      .then((data) => setMatches(data.matches))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Fantasy Matches</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((m) => (
          <div key={m.match_id} className="p-6 rounded-2xl shadow-md bg-white">
            <h2 className="text-xl font-bold">
              {m.team1} vs {m.team2}
            </h2>
            <p className="text-gray-500 mt-2">
              {new Date(m.match_date).toLocaleString()}
            </p>

            <div className="mt-4 flex gap-3">
              <button
                className="px-4 py-2 rounded-xl bg-red-600 text-white"
                onClick={() => navigate(`/fantasy/create/${m.match_id}`)}
              >
                Create Team
              </button>

              <button
                className="px-4 py-2 rounded-xl border border-gray-200"
                onClick={() => navigate(`/fantasy/view/${m.match_id}`)}
              >
                View Team
              </button>

              <button
                className="px-4 py-2 rounded-xl border border-gray-200"
                onClick={() => navigate(`/fantasy/results/${m.match_id}`)}
              >
                View Results
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
