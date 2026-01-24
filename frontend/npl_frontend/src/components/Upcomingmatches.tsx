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
    if (match.status.toLowerCase() === "completed") {
      navigate(`/fantasy/results/${match.id}`);
      return;
    }

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Upcoming Matches
        </h2>
        <div className="bg-red-100 p-3 rounded-full">
          <CalendarDays className="text-red-600 w-6 h-6" />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((match) => {
            const isCompleted = match.status === "Completed";

            return (
              <div
                key={match.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1">
                      {match.teams}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ml-2 ${
                        isCompleted
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-6">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {match.time}
                  </div>

                  <button
                    onClick={() => handleCreateOrView(match)}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
                      isCompleted
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
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