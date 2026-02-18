import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Trophy, LogOut, ChevronDown } from "lucide-react";
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
      className={`fixed top-0 w-full z-50 transition-all ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-gradient-to-r from-red-600 to-blue-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            <span
              className={`font-bold text-xl ${
                scrolled ? "text-gray-800" : "text-white"
              }`}
            >
              NPL Fantasy
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavItem to="/leaderboard" label="Leaderboard" scrolled={scrolled} />
            <NavItem to="/players" label="Teams" scrolled={scrolled} />

            {!user && (
              <>
                <NavLink
                  to="/login"
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-500 transition"
                >
                  Register
                </NavLink>
              </>
            )}

            {/* ── Styled user profile dropdown ── */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
                    scrolled
                      ? "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800"
                      : "border-white/30 bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {/* Avatar circle */}
                  <span className="w-7 h-7 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-sm uppercase">
                    {user.username.charAt(0)}
                  </span>
                  <span className="font-medium text-sm">{user.username}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.username}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      <LogOut size={15} />
                      Logout
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
      `font-medium transition ${
        isActive
          ? "text-yellow-400"
          : scrolled
            ? "text-gray-700 hover:text-red-600"
            : "text-white hover:text-yellow-300"
      }`
    }
  >
    {label}
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