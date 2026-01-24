import { useEffect, useState } from "react";
import { apiFetch } from "./api";

interface Match {
  id: number;
  teams: string;
  match_date: string;
  status: string;
}

interface Team {
  team_id: number;
  team_name: string;
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1, setTeam1] = useState(0);
  const [team2, setTeam2] = useState(0);
  const [date, setDate] = useState("");

  const fetchMatches = async () => {
    const res = await apiFetch("matches/");
    setMatches(res.matches);
  };

  const fetchTeams = async () => {
    const res = await apiFetch("teams/");
    setTeams(res.teams);
    if (res.teams.length) {
      setTeam1(res.teams[0].team_id);
      setTeam2(res.teams[0].team_id);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const handleAdd = async () => {
    await apiFetch("matches/add/", {
      method: "POST",
      body: JSON.stringify({ match_date: date, team_1: team1, team_2: team2 }),
    });
    setDate("");
    fetchMatches();
  };

  const handleDelete = async (id: number) => {
    await apiFetch(`matches/${id}/delete/`, { method: "DELETE" });
    fetchMatches();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Matches</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={team1}
          onChange={(e) => setTeam1(+e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {teams.map((t) => (
            <option key={t.team_id} value={t.team_id}>
              {t.team_name}
            </option>
          ))}
        </select>
        <select
          value={team2}
          onChange={(e) => setTeam2(+e.target.value)}
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
          className="bg-red-600 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {matches.map((m) => (
          <li
            key={m.id}
            className="flex justify-between bg-gray-100 p-2 rounded"
          >
            <span>
              {m.match_date} – {m.teams} ({m.status})
            </span>
            <button onClick={() => handleDelete(m.id)} className="text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
