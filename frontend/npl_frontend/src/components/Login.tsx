import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-6 py-20 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-linear-to-br from-brand-red to-brand-red-dark p-12 text-center">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Welcome Back</h1>
            <p className="text-white/70 font-bold text-xs uppercase tracking-widest mt-2">NPL Fantasy League</p>
          </div>

          <div className="p-10 md:p-12">
            {error && (
              <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 text-center mb-8 animate-shake">
                <p className="text-brand-red font-bold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-brand-blue focus:bg-white transition-all transition-duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-brand-blue focus:bg-white transition-all transition-duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-brand-blue-dark transition-all duration-300 active:scale-95 disabled:opacity-60 overflow-hidden"
              >
                <span className="relative z-10">{loading ? "Authenticating..." : "Login"}</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                New to the League?{" "}
                <NavLink
                  to="/register"
                  className="text-brand-red hover:text-brand-red-dark transition-colors"
                >
                  Join the League
                </NavLink>
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Game On • Draft Smart</p>
      </div>
    </div>
  );
}
