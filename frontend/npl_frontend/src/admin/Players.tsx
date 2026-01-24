import { useEffect, useState } from "react";
import { apiFetch } from "./api";

interface Player {
  player_id: number;
  player_name: string;
  role: string;
  cost: number;
  team_id: number;
}

interface Team {
  team_id: number;
  team_name: string;
}

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [player_name, setPlayerName] = useState("");
  const [role, setRole] = useState("");
  const [cost, setCost] = useState(0);
  const [teamId, setTeamId] = useState(0);

  const fetchPlayers = async () => {
    const res = await apiFetch("players/");
    setPlayers(res.players);
  };

  const fetchTeams = async () => {
    const res = await apiFetch("teams/");
    setTeams(res.teams);
    if (res.teams.length) setTeamId(res.teams[0].team_id);
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const handleAdd = async () => {
    await apiFetch("players/add/", {
      method: "POST",
      body: JSON.stringify({ player_name, role, cost, team_id: teamId }),
    });
    setPlayerName("");
    setRole("");
    setCost(0);
    fetchPlayers();
  };

  const handleDelete = async (id: number) => {
    await apiFetch(`players/${id}/delete/`, { method: "DELETE" });
    fetchPlayers();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Players</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={player_name}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Name"
          className="border px-2 py-1 rounded"
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(+e.target.value)}
          className="border px-2 py-1 rounded w-20"
        />
        <select
          value={teamId}
          onChange={(e) => setTeamId(+e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {teams.map((t) => (
            <option key={t.team_id} value={t.team_id}>
              {t.team_name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {players.map((p) => (
          <li
            key={p.player_id}
            className="flex justify-between bg-gray-100 p-2 rounded"
          >
            <span>
              {p.player_name} ({p.role}) – {p.cost}
            </span>
            <button
              onClick={() => handleDelete(p.player_id)}
              className="text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
