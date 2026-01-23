import { useState } from "react";
import { NavLink } from "react-router-dom";

const matches = [
  { id: 1, teams: "Kathmandu Gurkhas vs Pokhara Avengers" },
  { id: 2, teams: "Chitwan Rhinos vs Lumbini Lions" },
];

export default function MyTeams() {
  const [teams, setTeams] = useState<Record<number, string[]>>({
    1: ["Rohit Paudel", "Dipendra Singh Airee"],
    2: ["Sandeep Lamichhane"],
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">My Teams</h1>
      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="font-semibold">{match.teams}</h2>
            <p className="text-sm text-gray-500">
              {teams[match.id]?.length || 0} Players Selected
            </p>
          </div>
          <NavLink
            to={`/create/${match.id}`}
            className="text-red-600 font-semibold hover:underline"
          >
            View / Edit Team →
          </NavLink>
        </div>
      ))}
    </div>
  );
}
