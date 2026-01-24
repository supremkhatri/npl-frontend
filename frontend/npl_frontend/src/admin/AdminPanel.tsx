import { useState } from "react";
import Teams from "./Teams";
import Players from "./Players";
import Matches from "./Matches";

export default function AdminPanel() {
  const [section, setSection] = useState<"teams" | "players" | "matches">("teams");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setSection("teams")} className="px-4 py-2 bg-blue-600 text-white rounded">Teams</button>
        <button onClick={() => setSection("players")} className="px-4 py-2 bg-green-600 text-white rounded">Players</button>
        <button onClick={() => setSection("matches")} className="px-4 py-2 bg-red-600 text-white rounded">Matches</button>
      </div>

      <div>
        {section === "teams" && <Teams />}
        {section === "players" && <Players />}
        {section === "matches" && <Matches />}
      </div>
    </div>
  );
}
