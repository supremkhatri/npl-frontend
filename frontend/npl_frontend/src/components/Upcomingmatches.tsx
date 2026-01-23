import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { NavLink } from "react-router-dom";

interface Match {
  id: number;
  teams: string;
  time: string;
  status: string;
}

function Upcomingmatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/matches/", {
          credentials: "include", // safe to keep
        });

        if (!res.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await res.json();
        setMatches(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Upcoming Matches
        </h2>
        <CalendarDays className="text-red-600" />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-center">Loading matches...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {/* Matches */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-800 text-lg">
                {match.teams}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {match.time}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {match.status}
                </span>
                <NavLink
                  to={`/fantasy/create/${match.id}`}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Create Team →
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Upcomingmatches;
