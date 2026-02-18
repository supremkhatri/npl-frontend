import { NavLink } from "react-router-dom";
import { Users, Trophy, PlusCircle, LogIn } from "lucide-react";
import Upcomingmatches from "./Upcomingmatches";
import { useAuth } from "./context/AuthContext"; // adjust path as needed

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-red-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Play NPL Fantasy League
          </h1>
          <p className="mt-4 text-lg text-red-100">
            Create your team, join contests, and win real rewards
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {/* Always visible */}
            <NavLink
              to="/upcoming-matches"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
            >
              Upcoming Matches
            </NavLink>

            {/* Only shown when logged in */}
            {!loading && user && (
              <NavLink
                to="/my-teams"
                className="bg-white/10 border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition"
              >
                My Teams
              </NavLink>
            )}

            {/* Shown when logged out — prompt to sign in */}
            {!loading && !user && (
              <NavLink
                to="/login"
                className="bg-white/10 border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition flex items-center gap-2"
              >
                <LogIn size={18} />
                Sign In to Play
              </NavLink>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Matches — visible to everyone */}
      <Upcomingmatches />


      {/* How It Works — always visible */}
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

          {/* Create Team CTA under How It Works — only for logged-in users */}
          {!loading && user && (
            <div className="mt-12 text-center">
              <NavLink
                to="/my-teams"
                className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-500 transition"
              >
                Create Your Team Now
              </NavLink>
            </div>
          )}

          {/* Register CTA — only for logged-out users */}
          {!loading && !user && (
            <div className="mt-12 text-center">
              <NavLink
                to="/register"
                className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-500 transition"
              >
                Get Started for Free
              </NavLink>
            </div>
          )}
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