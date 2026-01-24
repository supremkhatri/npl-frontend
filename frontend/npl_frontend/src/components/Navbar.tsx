import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Trophy, User, LogOut } from "lucide-react";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
            <NavItem to="/my-teams" label="My Team" scrolled={scrolled} />
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

            {user && (
              <div className="flex items-center gap-4">
                <User className="text-gray-700" />
                <span className="font-medium text-gray-700">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col px-6 py-4 gap-4">
            <MobileNavItem to="/my-teams" label="My Team" />
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

            {user?.username && (
              <div className="flex flex-col gap-2">
                <span className="font-medium text-gray-700 text-center">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-500 transition"
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
