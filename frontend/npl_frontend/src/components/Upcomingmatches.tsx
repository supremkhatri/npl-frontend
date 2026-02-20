import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCSRF, getCookie } from "./csrf";
import { useAuth } from "./context/AuthContext"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

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
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/matches/`, {
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
      `${API_BASE_URL}/fantasy/create/${match.id}/`,
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
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Upcoming Battles
          </h2>
          <p className="mt-2 text-gray-500 font-medium">Draft your team before the first ball is bowled.</p>
        </div>
        <div className="bg-linear-to-tr from-brand-red to-brand-red-dark p-4 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <CalendarDays className="text-white w-7 h-7" />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-100 border-t-brand-red"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-brand-red/20 rounded-3xl p-8 text-center soft-shadow mb-12">
          <p className="text-brand-red font-bold text-lg">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => {
            const isCompleted = match.status.toLowerCase() === "completed";

            return (
              <div
                key={match.id}
                className="group bg-white rounded-[32px] soft-shadow border border-gray-100 overflow-hidden hover-lift transition-all duration-500"
              >
                <div className="relative p-8">
                  {/* Status Badge */}
                  <div className="absolute top-8 right-8">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                        isCompleted
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-brand-blue/5 text-brand-blue border-brand-blue/10"
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>

                  <div className="mb-8 pr-16 text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Match # {match.id}</p>
                    <h3 className="font-extrabold text-gray-900 text-2xl leading-tight group-hover:text-brand-red transition-colors duration-300">
                      {match.teams}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-gray-500 font-bold text-sm mb-10 bg-gray-50 p-3 rounded-2xl">
                    <div className="bg-white p-2 rounded-lg shadow-xs">
                      <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {match.time}
                  </div>

                  <button
                    onClick={() => handleCreateOrView(match)}
                    className={`w-full py-5 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95 ${
                      isCompleted
                        ? "bg-brand-blue-dark text-white hover:bg-brand-blue"
                        : "bg-brand-red text-white hover:bg-brand-red-dark"
                    }`}
                  >
                    {user ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>{isCompleted ? "Review Match" : "Draft Squad"}</span>
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    ) : (
                      <span className="text-sm">Sign in to Compete</span>
                    )}
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