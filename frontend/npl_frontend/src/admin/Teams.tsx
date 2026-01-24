import { useEffect, useState } from "react";
import { apiFetch } from "./api";

interface Team {
  team_id: number;
  team_name: string;
  acronym: string;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");

  const fetchTeams = async () => {
    const res = await apiFetch("teams/");
    setTeams(res.teams);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAdd = async () => {
    await apiFetch("teams/add/", {
      method: "POST",
      body: JSON.stringify({ team_name: name, acronym: acronym }),
    });
    setName("");
    setAcronym("");
    fetchTeams();
  };

  const handleDelete = async (id: number) => {
    await apiFetch(`teams/${id}/delete/`, { method: "DELETE" });
    fetchTeams();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Teams</h2>

      <div className="flex gap-2 mb-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Team Name" className="border px-2 py-1 rounded" />
        <input value={acronym} onChange={e => setAcronym(e.target.value)} placeholder="Acronym" className="border px-2 py-1 rounded" />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
      </div>

      <ul className="space-y-2">
        {teams.map(t => (
          <li key={t.team_id} className="flex justify-between bg-gray-100 p-2 rounded">
            <span>{t.team_name} ({t.acronym})</span>
            <button onClick={() => handleDelete(t.team_id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
