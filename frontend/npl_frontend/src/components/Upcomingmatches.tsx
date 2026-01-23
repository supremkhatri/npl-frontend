import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCSRF, getCookie } from "./csrf";

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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/matches/", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch matches");

        const data = await res.json();
        setMatches(data.matches ?? data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleCreateOrView = async (match: Match) => {
    // ✅ If match completed → go to results
    if (match.status.toLowerCase() === "completed") {
      navigate(`/fantasy/results/${match.id}`);
      return;
    }

    // ✅ Otherwise → create or view team
    await getCSRF();
    const csrfToken = getCookie("csrftoken");

    const res = await fetch(
      `http://127.0.0.1:8000/fantasy/create/${match.id}/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken && { "X-CSRFToken": csrfToken }),
        },
      }
    );

    const data = await res.json();
    console.log("POST response:", data);

    if (data.status === "created") {
      navigate(`/fantasy/select/${match.id}`);
    } else if (data.status === "exists") {
      navigate(`/fantasy/view/${match.id}`);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Upcoming Matches
        </h2>
        <CalendarDays className="text-red-600" />
      </div>

      {loading && (
        <p className="text-gray-500 text-center">Loading matches...</p>
      )}

      {error && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const isCompleted =
              match.status === "Completed";

            return (
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
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      isCompleted
                        ? "bg-green-200 text-gray-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {match.status}
                  </span>

                  <button
                    onClick={() => handleCreateOrView(match)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    {isCompleted ? "View Results →" : "Create Team →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Upcomingmatches;
