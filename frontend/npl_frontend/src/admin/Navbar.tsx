import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between">
      <div className="font-bold text-xl">Admin Panel</div>
      <div className="space-x-4">
        <Link to="/admin" className="hover:underline">Dashboard</Link>
        <Link to="/admin/teams" className="hover:underline">Teams</Link>
        <Link to="/admin/players" className="hover:underline">Players</Link>
        <Link to="/admin/matches" className="hover:underline">Matches</Link>
      </div>
    </nav>
  );
}
