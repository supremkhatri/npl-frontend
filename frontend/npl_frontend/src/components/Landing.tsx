import { NavLink } from "react-router-dom";
import { Users, Trophy, PlusCircle, LogIn } from "lucide-react";
import Upcomingmatches from "./Upcomingmatches";
import { useAuth } from "./context/AuthContext"; // adjust path as needed

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 bg-linear-to-br from-brand-red-dark via-brand-red to-brand-blue">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-brand-blue-light/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-8 animate-bounce">
            <span className="text-sm font-bold tracking-wider text-white uppercase">New Season Now Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Elevate Your <span className="text-brand-yellow">Game</span>,<br />
            Rule the <span className=" decoration-brand-yellow/30 underline-offset-8">Draft</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Build your dream team, outsmart the competition, and claim your glory in the ultimate NPL Fantasy League.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
            <NavLink
              to="/upcoming-matches"
              className="group relative bg-brand-yellow text-brand-blue-dark px-10 py-4 rounded-2xl font-extrabold text-lg soft-shadow hover:bg-white hover:text-brand-red transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Start Playing Now</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </NavLink>
            {!loading && !user && (
              <NavLink
                to="/login"
                className="glass-dark px-10 py-4 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-3 border border-white/20"
              >
                <LogIn size={20} />
                Sign In to Play
              </NavLink>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Matches — visible to everyone */}
      <Upcomingmatches />


      {/* How It Works — always visible */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-lg font-bold text-brand-red uppercase tracking-widest mb-4">The Playbook</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">How to Rule the League</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Step
              icon={<div className="bg-red-50 p-6 rounded-3xl group-hover:bg-brand-red transition-colors duration-500"><PlusCircle className="text-brand-red group-hover:text-white" size={40} /></div>}
              title="Draft Your Squad"
              desc="Scout and select 7 elite players within your budget. Every credit counts towards your victory."
            />
            <Step
              icon={<div className="bg-blue-50 p-6 rounded-3xl group-hover:bg-brand-blue transition-colors duration-500"><Users className="text-brand-blue group-hover:text-white" size={40} /></div>}
              title="Dominate Contests"
              desc="Enter high-stakes arenas and pit your strategy against thousands of rivals worldwide."
            />
            <Step
              icon={<div className="bg-yellow-50 p-6 rounded-3xl group-hover:bg-brand-yellow transition-colors duration-500"><Trophy className="text-brand-yellow-dark group-hover:text-brand-blue-dark" size={40} /></div>}
              title="Claim the Crown"
              desc="Climb the ranks, secure massive points, and win legendary rewards for your expertise."
            />
          </div>

          {/* Create Team CTA under How It Works — only for logged-in users */}
          {!loading && user && (
            <div className="mt-20 text-center">
              <NavLink
                to="/my-teams"
                className="inline-flex items-center gap-3 bg-brand-red text-white px-12 py-5 rounded-2xl font-extrabold text-lg hover:bg-brand-red-dark soft-shadow transition-all duration-300 transform hover:scale-105"
              >
                Create Your Team Now
              </NavLink>
            </div>
          )}

          {/* Register CTA — only for logged-out users */}
          {!loading && !user && (
            <div className="mt-20 text-center">
              <NavLink
                to="/register"
                className="inline-flex items-center gap-3 bg-brand-red text-white px-12 py-5 rounded-2xl font-extrabold text-lg hover:bg-brand-red-dark soft-shadow transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey for Free
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
  <div className="group flex flex-col items-center p-10 bg-white rounded-[40px] border border-gray-100 soft-shadow hover-lift transition-all duration-500 text-center">
    <div className="mb-8 transform group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <h3 className="font-extrabold text-2xl text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
  </div>
);