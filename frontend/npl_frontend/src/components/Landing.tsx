import { NavLink } from "react-router-dom";
import { Users, Trophy, PlusCircle } from "lucide-react";
import Upcomingmatches from "./Upcomingmatches";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Play NPL Fantasy League
          </h1>
          <p className="mt-4 text-lg text-red-100">
            Create your team, join contests, and win real rewards
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <NavLink
              to="/contests"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
            >
              Join Contest
            </NavLink>
            <NavLink
              to="/my-team"
              className="bg-white/10 border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Create Team
            </NavLink>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <Upcomingmatches />

      {/* How It Works */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
            How NPL Fantasy Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <Step
              icon={<PlusCircle className="text-red-600" size={36} />}
              title="Create Your Team"
              desc="Select your best 11 players within the credit limit"
            />
            <Step
              icon={<Users className="text-blue-600" size={36} />}
              title="Join Contests"
              desc="Compete with thousands of fantasy players"
            />
            <Step
              icon={<Trophy className="text-yellow-500" size={36} />}
              title="Win Rewards"
              desc="Score points and climb the leaderboard"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const Step = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="mb-4">{icon}</div>
    <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
    <p className="text-gray-500 mt-2 text-sm">{desc}</p>
  </div>
);
