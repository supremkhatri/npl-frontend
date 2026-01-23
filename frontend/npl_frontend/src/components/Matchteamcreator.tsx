import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, CheckCircle, XCircle } from "lucide-react";

type Player = { id: number; name: string; role: string; credits: number };
const TOTAL_CREDITS = 100;
const MAX_PLAYERS = 11;

// Mock player pool
const players: Player[] = [
  { id: 1, name: "Rohit Paudel", role: "BAT", credits: 9 },
  { id: 2, name: "Dipendra Singh Airee", role: "AR", credits: 9.5 },
  { id: 3, name: "Sandeep Lamichhane", role: "BOWL", credits: 9 },
  { id: 4, name: "Kushal Bhurtel", role: "BAT", credits: 8.5 },
  { id: 5, name: "Aasif Sheikh", role: "WK", credits: 8 },
  { id: 6, name: "Karan KC", role: "BOWL", credits: 8.5 },
];

export default function MatchTeamCreator() {
  const { matchId } = useParams<{ matchId: string }>();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  // Example: fetch existing team for this match from backend here
  useEffect(() => {
    // fetch(`/api/team/${matchId}`).then(...).then(data => setSelectedPlayers(data))
  }, [matchId]);

  const usedCredits = selectedPlayers.reduce((sum, p) => sum + p.credits, 0);
  const creditsLeft = TOTAL_CREDITS - usedCredits;

  const togglePlayer = (player: Player) => {
    const isSelected = selectedPlayers.some((p) => p.id === player.id);
    if (!isSelected) {
      if (selectedPlayers.length >= MAX_PLAYERS) return;
      if (player.credits > creditsLeft) return;
      setSelectedPlayers([...selectedPlayers, player]);
    } else {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    }
  };

  const saveTeam = () => {
    // Send selectedPlayers to backend with matchId
    // fetch(`/api/team/${matchId}`, { method: 'POST', body: JSON.stringify(selectedPlayers) })
    alert(`Team saved for match ${matchId}`);
  };

  return (
    <div className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Team for Match {matchId}</h1>

      {/* Selected Players */}
      {selectedPlayers.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selectedPlayers.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full"
            >
              {p.name} ({p.role})
              <XCircle className="cursor-pointer" onClick={() => togglePlayer(p)} />
            </div>
          ))}
        </div>
      )}

      {/* Player Pool */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((p) => {
          const isSelected = selectedPlayers.some((s) => s.id === p.id);
          const disabled = !isSelected && (selectedPlayers.length >= MAX_PLAYERS || p.credits > creditsLeft);
          return (
            <div
              key={p.id}
              className={`bg-white rounded-xl p-4 border flex justify-between items-center ${
                isSelected ? "border-green-500" : "border-gray-200 hover:border-red-400"
              }`}
            >
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.role} · {p.credits} Cr</p>
              </div>
              <button
                disabled={disabled}
                onClick={() => togglePlayer(p)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                  isSelected ? "bg-green-100 text-green-700" : disabled ? "bg-gray-200 text-gray-400" : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {isSelected ? <><CheckCircle size={16} /> Selected</> : <><Plus size={16} /> Add</>}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          disabled={selectedPlayers.length !== MAX_PLAYERS}
          onClick={saveTeam}
          className={`px-6 py-3 rounded-xl font-semibold ${
            selectedPlayers.length === MAX_PLAYERS
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save Team
        </button>
      </div>
    </div>
  );
}
