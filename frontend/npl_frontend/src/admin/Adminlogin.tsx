import { useState } from "react";
import { apiFetch } from "./api";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await apiFetch("login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      onLogin();
    } catch {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>

      <input className="border w-full mb-2 px-2 py-1" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="border w-full mb-2 px-2 py-1" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button onClick={handleLogin} className="bg-black text-white w-full py-1 mt-2 rounded">
        Login
      </button>
    </div>
  );
}
