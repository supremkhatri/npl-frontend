import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCSRF, getCookie } from "./csrf";

interface Player {
  player_id: number;
  player_name: string;
  role: string;
  cost: number;
  team_name: string;
  team_id: number;
}

export default function FantasySelectPlayers() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [captain, setCaptain] = useState<number | null>(null);
  const [viceCaptain, setViceCaptain] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const MAX_PLAYERS = 7;
  const MAX_BUDGET = 60;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/fantasy/select/${matchId}/`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPlayers(data.players))
      .finally(() => setLoading(false));
  }, [matchId]);

  const selectedPlayers = players.filter((p) => selected.includes(p.player_id));

  const totalCost = selectedPlayers.reduce((s, p) => s + p.cost, 0);
  const budgetLeft = MAX_BUDGET - totalCost;
  const playersLeft = MAX_PLAYERS - selected.length;

  const togglePlayer = (id: number) => {
    setError(null);

    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
      if (captain === id) setCaptain(null);
      if (viceCaptain === id) setViceCaptain(null);
      return;
    }

    const p = players.find((x) => x.player_id === id);
    if (!p) return;

    if (selected.length >= MAX_PLAYERS)
      return setError("You can select only 7 players");
    if (budgetLeft < p.cost) return setError("Not enough budget");

    setSelected([...selected, id]);
  };

  const submitTeam = async () => {
    if (selected.length !== 7 || !captain || !viceCaptain) {
      setError("Complete your team selection");
      return;
    }

    await getCSRF();
    const csrfToken = getCookie("csrftoken");

    const res = await fetch(
      `http://127.0.0.1:8000/fantasy/select/${matchId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken && { "X-CSRFToken": csrfToken }),
        },
        credentials: "include",
        body: JSON.stringify({
          players: selected,
          captain,
          vice_captain: viceCaptain,
        }),
      },
    );

    if (res.ok) navigate(`/fantasy/${matchId}`);
    else setError("Failed to save team");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* PLAYER POOL */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold mb-3">Available Players</h2>

        <div className="h-[70vh] overflow-y-auto space-y-3 pr-2">
          {players.map((p) => {
            const isSelected = selected.includes(p.player_id);

            return (
              <div
                key={p.player_id}
                onClick={() => togglePlayer(p.player_id)}
                className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center
                ${
                  isSelected
                    ? "bg-red-50 border-red-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div>
                  <p className="font-semibold">{p.player_name}</p>
                  <p className="text-xs text-gray-500">
                    {p.team_name} · {p.role}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">₹{p.cost}</p>
                  {isSelected && (
                    <p className="text-xs text-red-600 font-semibold">
                      Selected
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED TEAM */}
      <div className="sticky top-6 h-fit bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-xl font-bold mb-4">Your Team</h2>

        <div className="flex justify-between text-sm mb-3">
          <span>Players Left</span>
          <span className="font-bold">{playersLeft}</span>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <span>Budget Left</span>
          <span className="font-bold">₹{budgetLeft}</span>
        </div>

        <div className="space-y-2 mb-4">
          {selectedPlayers.map((p) => (
            <div
              key={p.player_id}
              className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg"
            >
              <span>{p.player_name}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCaptain(p.player_id)}
                  className={`px-2 py-0.5 rounded text-xs
                    ${
                      captain === p.player_id
                        ? "bg-red-600 text-white"
                        : "bg-gray-200"
                    }`}
                >
                  C
                </button>
                <button
                  onClick={() => setViceCaptain(p.player_id)}
                  className={`px-2 py-0.5 rounded text-xs
                    ${
                      viceCaptain === p.player_id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                >
                  VC
                </button>
              </div>
            </div>
          ))}

          {[...Array(playersLeft)].map((_, i) => (
            <div
              key={i}
              className="text-center text-xs text-gray-400 border border-dashed py-2 rounded-lg"
            >
              Empty Slot
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 font-semibold mb-3">{error}</p>
        )}

        <button
          onClick={submitTeam}
          className="w-full py-3 rounded-xl bg-red-600 text-white font-bold"
        >
          Save Team
        </button>
      </div>
    </div>
  );
}
