import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Team {
  team_name: string;
  acronym: string;
}

interface Player {
  player_id: number;
  player_name: string;
  role: string;
  cost: number;
}

export default function Players() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/teams/list/`)
      .then((res) => res.json())
      .then(setTeams)
      .catch(console.error);
  }, []);

  const loadPlayers = async (acronym: string) => {
    setSelectedTeam(acronym);
    setLoading(true);
    setPlayers([]);

    const start = Date.now();

    try {
      const res = await fetch(
        `${API_BASE_URL}/players/${acronym}/`
      );
      const data = await res.json();
      console.log("Fetched players:", data);
      const elapsed = Date.now() - start;
      if (elapsed < 600) {
        await new Promise((r) => setTimeout(r, 600 - elapsed));
      }

      setPlayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const roleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "batter":
        return "bg-yellow-400 text-black";
      case "bowler":
        return "bg-blue-500 text-white";
      case "allrounder":
        return "bg-purple-500 text-white";
      case "wicketkeeper":
        return "bg-green-400 text-black";
      default:
        return "bg-gray-400 text-black";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <span className="w-2 h-8 bg-brand-red rounded-full"></span>
            Teams
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Select a squad to view </p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {teams.map((team) => (
            <button
              key={team.acronym}
              onClick={() => loadPlayers(team.acronym)}
              className={`group relative p-8 rounded-[32px] border-2 text-left cursor-pointer transition-all duration-300 overflow-hidden
                ${
                  selectedTeam === team.acronym
                    ? "bg-brand-red border-brand-red text-white shadow-xl shadow-brand-red/20 scale-[1.02]"
                    : "bg-white border-gray-100 hover:border-brand-red/30 hover:shadow-lg hover:scale-[1.02]"
                }`}
            >
              <div className={`text-xl font-black mb-1 transition-colors ${selectedTeam === team.acronym ? "text-white" : "text-gray-900 group-hover:text-brand-red"}`}>
                {team.team_name}
              </div>
              <div className={`text-sm font-bold uppercase tracking-widest opacity-60`}>
                {team.acronym}
              </div>
              
              {/* Decorative Element */}
              <div className={`absolute -right-4 -bottom-4 w-20 h-20 bg-current opacity-[0.03] rounded-full transition-transform duration-500 group-hover:scale-150`}></div>
            </button>
          ))}
        </div>

        {/* Players Section */}
        {selectedTeam && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <span className="text-brand-red text-3xl"></span> {selectedTeam} Squad
              </h2>
              <div className="text-gray-400 font-bold text-sm bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-xs">
                {players.length} Players Found
              </div>
            </div>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-white border border-gray-100 rounded-[40px] animate-pulse"
                  />
                ))}
              </div>
            )}

            {!loading && players.length === 0 && (
            <p className="text-gray-500">
              No players found for this team.
            </p>
            )}

            {!loading && players.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player) => (
                  <div
                    key={player.player_id}
                    className="relative rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-sm p-5
                      hover:shadow-md transition duration-200
                      border border-transparent
                      hover:border-gray-100"
                  >
                    <div className="text-xl font-bold mb-2">
                      {player.player_name}
                    </div>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${roleColor(
                        player.role
                      )}`}
                    >
                      {player.role}
                    </span>

                    <div className="absolute top-5 right-5">
                      <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <span>₹</span>
                        <span>{player.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
