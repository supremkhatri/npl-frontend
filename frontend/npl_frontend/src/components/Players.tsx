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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Teams
      </h1>

      {/* Teams */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
        {teams.map((team) => (
          <button
            key={team.acronym}
            onClick={() => loadPlayers(team.acronym)}
            className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 shadow-md
              ${
                selectedTeam === team.acronym
                  ? "bg-gradient-to-br from-red-600 to-red-400 text-white shadow-lg scale-[1.02]"
                  : "bg-white hover:shadow-lg hover:scale-[1.02]"
              }`}
          >
            <div className="text-lg font-semibold">
              {team.team_name}
            </div>
            <div className="text-xs opacity-80">
              {team.acronym}
            </div>
          </button>
        ))}
      </div>

      {/* Players */}
      {selectedTeam && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Players – {selectedTeam}
          </h2>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 rounded-2xl animate-pulse"
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

                  {/* <div className="mt-4 text-xs text-gray-500">
                    Fantasy score coming soon...
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
