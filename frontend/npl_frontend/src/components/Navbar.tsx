import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-sm py-2"
          : "bg-linear-to-r from-brand-red to-brand-blue py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="bg-white/10 p-1 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 backdrop-blur-md">
              <img 
                src="/npl-fantasy-league-logo.png" 
                alt="NPL Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <span
              className={`font-bold text-2xl tracking-tight transition-colors duration-300 ${
                scrolled ? "text-gradient" : "text-white"
              }`}
            >
              NPL Fantasy
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavItem to="/leaderboard" label="Leaderboard" scrolled={scrolled} />
            <NavItem to="/players" label="Teams" scrolled={scrolled} />

              {user && (
                <NavItem to="/my-teams" label="My Teams" scrolled={scrolled} />
              )}
            {!user && (
              <div className="flex items-center gap-3 ml-4">
                <NavLink
                  to="/login"
                  className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    scrolled 
                      ? "text-gray-700 hover:text-brand-red" 
                      : "text-white hover:text-brand-yellow"
                  }`}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-brand-yellow text-brand-blue-dark px-6 py-2 rounded-xl font-bold hover:bg-white hover:text-brand-red soft-shadow transition-all duration-300 transform hover:scale-105"
                >
                  Join Now
                </NavLink>
              </div>
            )}

            {/* ── Styled user profile dropdown ── */}
            {user && (
              <div className="relative ml-4">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-300 ${
                    scrolled
                      ? "border-gray-200 bg-white/50 hover:bg-white text-gray-800 shadow-sm"
                      : "border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {/* Avatar circle */}
                  <span className="w-8 h-8 rounded-full bg-linear-to-tr from-brand-yellow to-brand-yellow-dark text-brand-blue-dark flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                    {user.username.charAt(0)}
                  </span>
                  <span className="font-semibold text-sm">{user.username}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Account</p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user.username}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-5 py-4 text-sm text-brand-red hover:bg-red-50 transition-colors duration-200 font-bold"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden ${scrolled ? "text-gray-800" : "text-white"}`}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col px-6 py-4 gap-4">
            <MobileNavItem to="/leaderboard" label="Leaderboard" />
            <MobileNavItem to="/players" label="Teams" />

            {!user && (
              <>
                <NavLink
                  to="/login"
                  className="bg-red-600 text-white text-center py-2 rounded-lg font-semibold"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-yellow-400 text-gray-900 text-center py-2 rounded-lg font-semibold"
                >
                  Register
                </NavLink>
              </>
            )}

            {/* ── Styled mobile user section ── */}
            {user?.username && (
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-1">
                  <span className="w-9 h-9 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-sm uppercase">
                    {user.username.charAt(0)}
                  </span>
                  <div>
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {user.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg font-semibold hover:bg-red-100 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

/* ---------- Helper Components ---------- */
const NavItem = ({
  to,
  label,
  scrolled,
}: {
  to: string;
  label: string;
  scrolled: boolean;
}) => (
  <NavLink
    to={to}
    className={({ isActive }: { isActive: boolean }) =>
      `text-sm font-bold tracking-wide uppercase transition-all duration-300 relative group ${
        isActive
          ? scrolled ? "text-brand-red" : "text-brand-yellow"
          : scrolled
            ? "text-gray-600 hover:text-brand-red"
            : "text-white/80 hover:text-white"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {label}
        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : ""}`}></span>
      </>
    )}
  </NavLink>
);

const MobileNavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className="text-gray-800 font-medium hover:text-red-600 transition"
  >
    {label}
  </NavLink>
);